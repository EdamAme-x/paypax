import { PayPayError, isPassword, isPhone, isUuid } from '..'
import { createHeader } from '../headers'
import type { LoginContext, OTP, baseHeader, loginResult } from '../types'

export class PayPay {
  phone: string = ''
  password: string = ''
  uuid: string | undefined
  token: string | undefined
  header: baseHeader = createHeader()
  cookie = {}

  // is Logged
  logged: boolean = false

  // one time password
  otp: OTP = {
    waiting: false,
    otp_prefix: '',
    otp_ref_id: '',
  } 

  constructor(phone: string, password: string) {
    if (isPhone(phone)) {
      if (isPassword(password)) {
        this.phone = phone
        this.password = password
      } else {
        new PayPayError('Password is not valid', 0)
      }
    } else {
      new PayPayError('Phone is not valid', 0)
    }
  }

  async login({
    uuid,
    token
  }: LoginContext): Promise<loginResult | undefined> {
    if (token) {
        this.token = token
        this.logged = true
        return {
            success: true,
            status: 'LoginSuccess'
        }
    }

    if (uuid) {
      if (isUuid(uuid)) {
        this.uuid = uuid
      } else {
        new PayPayError('UUID is not valid', 0)
      }
    }else {
        this.uuid = crypto.randomUUID()
    }

    const ctx = {
        'scope':'SIGN_IN',
        'client_uuid': this.uuid,
        'grant_type':'password',
        'username': this.phone,
        'password': this.password,
        'add_otp_prefix': true,
        'language':'ja'
    }

    const response = await fetch('https://www.paypay.ne.jp/app/v1/oauth/token', {
        method: 'POST',
        headers: this.header,
        body: JSON.stringify(ctx),
    })

    const result = await response.json()

    if ('access_token' in result) {
        this.token = result.access_token
        this.logged = true
        return {
            success: true,
            status: 'LoginSuccess'
        }
    } else {
        if (result['response_type'] === 'ErrorResponse') {
            return {
                success: false,
                status: 'LoginFailed'
            }
        }else {
            this.otp = {
                waiting: true,
                otp_prefix: result['otp_prefix'],
                otp_ref_id: result['otp_reference_id'],
            }
            return {
                success: false,
                status: 'LoginNeedOTP'
            }
        }
    }
  }

  getUuid(): string | undefined {
    if (this.uuid) {
      return this.uuid
    } else {
      new PayPayError('Not logged in yet.', 0)
    }
  }
}
