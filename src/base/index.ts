import { PayPayError, PayPayStatus, isPassword, isPhone, isUuid } from '..'
import { createHeader } from '../headers'
import type {
  CreateLinkContext,
  FetchContext,
  LoginContext,
  OTP,
  ReceiveLinkContext,
  ResponseAnyone,
  ResponseBalance,
  ResponseBody,
  ResponseCreateLink,
  ResponseGetLink,
  ResponseReceiveLink,
  ResponseUserInfo,
  SendMoneyContext,
  baseHeader,
  loginResult,
  loginResultStatus,
} from '../types'
import {
  parseBalanceContext,
  parseCookieFromMap,
  parseUserInfoContext,
  parseCreateLink,
  parseGetLink,
  parseReceiveLink,
  parseRecoveryCode,
  unparseRecoveryCode,
  parseAny,
} from '../utils/parse'
import { randomUUID } from '../utils/uuid'

export class PayPay {
  public phone: string = ''
  public password: string = ''
  public uuid: string | undefined
  public token: string | undefined
  public header: baseHeader = createHeader()
  public cookie = new Map<string, string>()
  public refresh_at: number = 0

  // is Logged
  private logged: boolean = false

  // one time password
  public otp: OTP = {
    waiting: false,
    otp_prefix: '',
    otp_ref_id: '',
  }

  constructor(phone: string, password: string) {
    if (!isPhone(phone)) {
      throw new PayPayError('Phone is not valid', 0).fire()
    }

    if (!isPassword(password)) {
      throw new PayPayError('Password is not valid', 0).fire()
    }

    this.phone = phone
    this.password = password
  }

  private createLoginResult(success: boolean, status: loginResultStatus): loginResult {
    return {
      success,
      status,
    }
  }

  async login({ uuid, token }: LoginContext = {}): Promise<loginResult> {
    if (this.isLogged()) {
      return this.createLoginResult(true, 'LoginAlreadySuccess')
    }

    if (token) {
      this.token = token
      this.logged = true
      this.refresh_at = Date.now()
      this.cookie.set('token', token)
      return this.createLoginResult(true, 'LoginSuccess')
    }

    if (uuid) {
      if (isUuid(uuid)) {
        this.uuid = uuid
      } else {
        throw new PayPayError('UUID is not valid', 0).fire()
      }
    } else {
      this.uuid = randomUUID()
    }

    const ctx = {
      scope: 'SIGN_IN',
      client_uuid: this.uuid,
      grant_type: 'password',
      username: this.phone,
      password: this.password,
      add_otp_prefix: true,
      language: 'ja',
    }

    const response = await fetch('https://www.paypay.ne.jp/app/v1/oauth/token', {
      method: 'POST',
      headers: this.header,
      body: JSON.stringify(ctx),
    })

    const result: ResponseBody = await response.json()

    if ('access_token' in result) {
      this.token = result.access_token
      this.logged = true
      this.refresh_at = Date.now()
      this.cookie.set('token', result.access_token)

      return this.createLoginResult(true, 'LoginSuccess')
    } else {
      if (result['response_type'] === 'ErrorResponse') {

        if ('result_info' in result) {
          if ('result_code' in result['result_info']) {
            if (result['result_info']['result_code'] === 'INTERNAL_AUTH_INVALID_GRANT_ERROR') {
              return this.createLoginResult(false, 'LoginIncorrectPassOrPhone')
            }
          }
        }

        return this.createLoginResult(false, 'LoginFailed')
      } else {
        this.otp = {
          waiting: true,
          otp_prefix: result['otp_prefix'],
          otp_ref_id: result['otp_reference_id'],
        }

        return this.createLoginResult(false, 'LoginNeedOTP')
      }
    }
  }

  isLogged(): boolean {
    return this.logged
  }

  async otpLogin(otp: string): Promise<loginResult> {
    if (this.isLogged()) {
      return this.createLoginResult(true, 'LoginAlreadySuccess')
    }

    if (this.otp.waiting) {
      const ctx = {
        scope: 'SIGN_IN',
        client_uuid: this.uuid,
        grant_type: 'otp',
        otp_prefix: this.otp.otp_prefix,
        otp: otp,
        otp_reference_id: this.otp.otp_ref_id,
        username_type: 'MOBILE',
        language: 'ja',
      }

      const response = await fetch('https://www.paypay.ne.jp/app/v1/oauth/token', {
        method: 'POST',
        headers: {
          ...this.header,
          'Content-Type': 'application/json',
          cookie: parseCookieFromMap(this.cookie),
        },
        body: JSON.stringify(ctx),
      })

      const result: ResponseBody = await response.json()

      if ('access_token' in result) {
        this.token = result.access_token
        this.logged = true
        this.refresh_at = Date.now()
        this.cookie.set('token', result.access_token)
        return this.createLoginResult(true, 'OTPLoginSuccess')
      } else {
        return this.createLoginResult(false, 'OTPLoginFail')
      }
    } else {
      return this.createLoginResult(false, 'LoginDontNeedOTP')
    }
  }

  getUuid(): string | undefined {
    if (this.uuid) {
      return this.uuid
    } else {
      throw new PayPayError('Not logged in yet.', 2).fire()
    }
  }

  async baseFetch(
    url: string,
    ctx: FetchContext
  ): Promise<{
    result: ResponseBody
    response: Response
  }> {
    const response = await fetch(url, {
      headers: {
        ...this.header,
        cookie: parseCookieFromMap(this.cookie),
      },
      ...ctx,
    })

    const result = await response.json()

    if (
      'header' in result &&
      'resultCode' in result['header'] &&
      'resultMessage' in result['header']
    ) {
      if (result['header']['resultCode'] === 'S0001') {
        // Refresh
        await this.login({
          uuid: this.uuid,
        })
      }
    }

    return {
      result,
      response,
    }
  }

  // Main
  async getBalance(): Promise<ResponseBalance> {
    if (!this.isLogged()) {
      throw new PayPayError('Do not logged in', 2).fire()
    }

    const { response, result } = await this.baseFetch(
      'https://www.paypay.ne.jp/app/v1/bff/getBalanceInfo',
      {
        method: 'GET',
      }
    )

    if (!response.ok) {
      return parseBalanceContext(result, false)
    }

    return parseBalanceContext(result, true)
  }

  async getUserInfo(): Promise<ResponseUserInfo> {
    if (!this.isLogged()) {
      throw new PayPayError('Do not logged in', 2).fire()
    }

    const { response, result } = await this.baseFetch(
      'https://www.paypay.ne.jp/app/v1/getUserProfile',
      {
        method: 'GET',
      }
    )

    if (!response.ok) {
      return parseUserInfoContext(result, false)
    }

    return parseUserInfoContext(result, true)
  }

  async createLink(amount: number, passcode?: string): Promise<ResponseCreateLink> {
    if (!this.isLogged()) {
      throw new PayPayError('Do not logged in', 2).fire()
    }

    if (amount < 1) {
      throw new PayPayError('Amount must be greater than 0', 1).fire()
    }

    const ctx: CreateLinkContext = {
      androidMinimumVersion: '3.45.0',
      requestId: randomUUID(),
      requestAt: new Date().toISOString(),
      theme: 'default-sendmoney',
      amount: amount,
      iosMinimumVersion: '3.45.0',
    }

    if (passcode) {
      ctx.passcode = passcode
    }

    const { response, result } = await this.baseFetch(
      'https://www.paypay.ne.jp/app/v2/p2p-api/executeP2PSendMoneyLink',
      {
        method: 'POST',
        body: JSON.stringify(ctx),
      }
    )

    if (!response.ok) {
      return parseCreateLink(result, false)
    }

    return parseCreateLink(result, true)
  }

  async getLink(link: string): Promise<ResponseGetLink> {
    if (!this.isLogged()) {
      throw new PayPayError('Do not logged in', 2).fire()
    }

    if (!link.includes('pay.paypay.ne.jp') || link.trim() === '') {
      throw new PayPayError('Invalid link', 1).fire()
    }

    const code = link.split('/').pop()

    const { response, result } = await this.baseFetch(
      `https://www.paypay.ne.jp/app/v2/p2p-api/getP2PLinkInfo?verificationCode=${code}`,
      {
        method: 'GET',
      }
    )

    if (!response.ok) {
      return parseGetLink(result, false)
    }

    return parseGetLink(result, true)
  }

  async receiveLink(link: string, passcode?: string): Promise<ResponseReceiveLink | undefined> {
    if (!this.isLogged()) {
      throw new PayPayError('Do not logged in', 2).fire()
    }

    if (passcode && passcode.length !== 4) {
      throw new PayPayError('Passcode must be 4 digits', 1).fire()
    }

    if (!link.includes('pay.paypay.ne.jp') || link.trim() === '') {
      throw new PayPayError('Invalid link', 1).fire()
    }

    try {
      const info = await this.getLink(link)

      const ctx: ReceiveLinkContext = {
        verificationCode: link.split('/').pop() ?? '',
        client_uuid: this.uuid ?? randomUUID(),
        passcode: passcode ?? '2189',
        requestAt: new Date().toISOString(),
        requestId: info.raw.payload.message.data.requestId,
        orderId: info.raw.payload.message.data.orderId,
        senderMessageId: info.raw.payload.message.messageId,
        senderChannelUrl: info.raw.payload.message.chatRoomId,
        iosMinimumVersion: '3.45.0',
        androidMinimumVersion: '3.45.0',
      }

      const { response, result } = await this.baseFetch(
        'https://www.paypay.ne.jp/app/v2/p2p-api/acceptP2PSendMoneyLink',
        {
          method: 'POST',
          body: JSON.stringify(ctx),
        }
      )

      if (!response.ok) {
        return parseReceiveLink(result, false)
      }

      return parseReceiveLink(result, true)
    } catch (_e) {
      throw new PayPayError('Invalid link', 1).fire()
    }
  }

  // sub
  async rejectLink(link: string): Promise<ResponseBody> {
    if (!this.isLogged()) {
      throw new PayPayError('Do not logged in', 2).fire()
    }

    if (!link.includes('pay.paypay.ne.jp') || link.trim() === '') {
      throw new PayPayError('Invalid link', 1).fire()
    }

    const code = link.split('/').pop()

    const { response, result } = await this.baseFetch(
      `https://www.paypay.ne.jp/app/v2/p2p-api/rejectP2PSendMoneyLink?verificationCode=${code}`,
      {
        method: 'POST',
        body: JSON.stringify({
          verificationCode: code,
          client_uuid: this.uuid ?? randomUUID(),
          requestId: randomUUID(),
          requestAt: new Date().toISOString(),
          iosMinimumVersion: '3.45.0',
          androidMinimumVersion: '3.45.0',
        }),
      }
    )

    if (!response.ok) {
      return parseAny(result, false)
    }

    return parseAny(result, true)
  }

  async sendMoney(amount: number, external_id: string): Promise<ResponseBody> {
    if (!this.isLogged()) {
      throw new PayPayError('Do not logged in', 2).fire()
    }

    if (amount < 1) {
      throw new PayPayError('Amount must be greater than 0', 1).fire()
    }

    if (!external_id || external_id.trim() === '') {
      throw new PayPayError('External id is required', 1).fire()
    }

    const ctx: SendMoneyContext = {
      theme: 'default-sendmoney',
      externalReceiverId: external_id,
      amount: amount,
      requestId: randomUUID(),
      requestAt: new Date().toISOString(),
      iosMinimumVersion: '3.45.0',
      androidMinimumVersion: '3.45.0',
    }

    const { response, result } = await this.baseFetch(
      'https://www.paypay.ne.jp/app/v2/p2p-api/executeP2PSendMoney',
      {
        method: 'POST',
        body: JSON.stringify(ctx),
      }
    )

    if (!response.ok) {
      return parseAny(result, false)
    }

    if (result.header.resultCode === 'S9999') {
      throw new PayPayError('You\'re not friends with user', 1).fire()
    }

    return parseAny(result, true)
  }

  async request(
    path: 'getProfileDisplayInfo' | 'getPay2BalanceHistory' | 'getPaymentMethodList'
  ): Promise<ResponseAnyone> {
    if (!this.isLogged()) {
      throw new PayPayError('Do not logged in', 2).fire()
    }

    const { response, result } = await this.baseFetch(
      `https://www.paypay.ne.jp/app/v2/bff/${path}`,
      {
        method: 'GET',
      }
    )

    if (!response.ok) {
      return parseAny(result, false)
    }

    return parseAny(result, true)
  }

  public getRecoveryCode(): string {
    if (!this.isLogged()) {
      throw new PayPayError('Do not logged in', 2).fire()
    }

    const code = parseRecoveryCode(this.phone, this.password, this.uuid ?? '')

    return code
  }

  async recoveryFromCode(code: string): Promise<loginResult> {
    const object = unparseRecoveryCode(code)
    this.phone = object.phone
    this.password = object.password

    return await this.login({
      uuid: this.uuid ?? randomUUID(),
    })
  }
}

export class PayPayRecovery {
  public phone: string
  public password: string
  public uuid: string

  constructor(code: string) {
    const object = unparseRecoveryCode(code)
    this.phone = object.phone
    this.password = object.password
    this.uuid = object.uuid ?? randomUUID()
  }

  async recovery(): Promise<PayPay> {
    const paypay = new PayPay(this.phone, this.password)

    const result = await paypay.login({
      uuid: this.uuid,
    })

    if (result.status === PayPayStatus.LoginNeedOTP || result.status === PayPayStatus.LoginFailed) {
      throw new PayPayError('Recovery failed', 1).fire()
    }

    return paypay
  }
}
