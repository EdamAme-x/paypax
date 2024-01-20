import { PayPayError, isSuccess } from '..'
import type {
  Anyone,
  ResponseAnyone,
  ResponseBalance,
  ResponseCreateLink,
  ResponseGetLink,
  ResponseReceiveLink,
  ResponseUserInfo,
} from '../types'

export function parseCookieFromMap(map: Map<string, string>): string {
  return Array.from(map.entries())
    .map(([key, value]) => `${key}=${value}`)
    .join('; ')
}

export const recoveryPrefix = 'eyJhbGc'

export function parseRecoveryCode(phone: string, password: string, uuid: string): string {
  const encode = (string: string): string => {
    return btoa(encodeURIComponent(string))
  }
  return `${recoveryPrefix}${encode(phone)}.${encode(password)}.${encode(uuid)}`
}

export function unparseRecoveryCode(recoveryCode: string): {
  phone: string
  password: string
  uuid: string
} {
  const decode = (string: string): string => {
    return decodeURIComponent(atob(string))
  }

  if (!recoveryCode.startsWith(recoveryPrefix)) {
    throw new PayPayError('Invalid recovery code', 2).fire()
  }

  const cache = recoveryCode.replace(recoveryPrefix, '').split('.')

  if (cache.length !== 3) {
    throw new PayPayError('Invalid recovery code', 3).fire()
  }

  const [phone, password, uuid] = cache

  return {
    phone: decode(phone),
    password: decode(password),
    uuid: decode(uuid),
  }
}

export function parseResultMessage(result: Anyone): string {
  if ('header' in result && 'resultMessage' in result.header) {
    return result.header.resultMessage ?? 'unknown'
  } else {
    return 'unknown'
  }
}

export function parseBalanceContext(result: Anyone, success: boolean): ResponseBalance {
  try {
    return {
      success: success && isSuccess(result),
      message: parseResultMessage(result),
      total: result.payload.total ?? 0,
      currency: result.payload.currency ?? 'JPY',
      updated_at: new Date(0).toISOString(),
      raw: result,
    }
  } catch (_e) {
    return {
      success: false,
      message: parseResultMessage(result),
      total: 0,
      currency: 'JPY',
      updated_at: new Date(0).toISOString(),
      raw: result,
    }
  }
}

export function parseUserInfoContext(result: Anyone, success: boolean): ResponseUserInfo {
  try {
    return {
      success: success && isSuccess(result),
      message: parseResultMessage(result),
      id: result.payload.id ?? 0,
      user_id: result.payload.user_defined_id ?? 'unknown',
      state: result.payload.state ?? 'unknown',
      first_name: result.payload.first_name ?? 'unknown',
      last_name: result.payload.last_name ?? 'unknown',
      display_name: result.payload.display_name ?? 'unknown',
      icon_url: result.payload.photo_url ?? 'unknown',
      phone_number: result.payload.mobile ?? 'unknown',
      email: result.payload.email ?? 'unknown',
      date_of_birth: result.payload.date_of_birth ?? 'unknown',
      external_id: result.payload.external_id ?? 'unknown',
      raw: result,
    }
  } catch (_e) {
    return {
      success: false,
      message: parseResultMessage(result),
      id: 0,
      user_id: 'unknown',
      state: 'unknown',
      first_name: 'unknown',
      last_name: 'unknown',
      display_name: 'unknown',
      icon_url: 'unknown',
      phone_number: 'unknown',
      email: 'unknown',
      date_of_birth: 'unknown',
      external_id: 'unknown',
      raw: result,
    }
  }
}

export function parseCreateLink(result: Anyone, success: boolean): ResponseCreateLink {
  try {
    return {
      success: success && isSuccess(result),
      message: parseResultMessage(result),
      orderId: result.payload.orderId ?? 'unknown',
      orderStatus: result.payload.orderStatus ?? 'unknown',
      link: result.payload.link ?? 'unknown',
      transactionAt: result.payload.transactionAt ?? new Date(0).toISOString(),
      expiry: result.payload.expiry ?? new Date(0).toISOString(),
      raw: result,
    }
  } catch (_e) {
    return {
      success: false,
      message: parseResultMessage(result),
      orderId: 'unknown',
      orderStatus: 'unknown',
      link: 'unknown',
      transactionAt: new Date(0).toISOString(),
      expiry: new Date(0).toISOString(),
      raw: result,
    }
  }
}

export function parseGetLink(result: Anyone, success: boolean): ResponseGetLink {
  try {
    if (!('pendingP2PInfo' in result.payload)) {
      return {
        success: false,
        message: parseResultMessage(result),
        orderId: '',
        orderType: '',
        description: '',
        imageUrl: '',
        amount: 0,
        link: '',
        isSetPasscode: false,
        createdAt: '',
        acceptedAt: '',
        money_type: '',
        sender_name: '',
        sender_external_id: '',
        photo_url: '',
        raw: result,
      }
    }

    return {
      success: success && isSuccess(result),
      message: parseResultMessage(result),
      orderId: result.payload.pendingP2PInfo.orderId ?? 'unknown',
      orderType: result.payload.pendingP2PInfo.orderType ?? 'unknown',
      description: result.payload.pendingP2PInfo.description ?? 'unknown',
      imageUrl: result.payload.pendingP2PInfo.imageUrl ?? 'unknown',
      amount: result.payload.pendingP2PInfo.amount ?? 0,
      link: result.payload.pendingP2PInfo.link ?? 'unknown',
      isSetPasscode: result.payload.pendingP2PInfo.isSetPasscode ?? false,
      createdAt: result.payload.pendingP2PInfo.createdAt ?? new Date(0).toISOString(),
      acceptedAt: result.payload.pendingP2PInfo.acceptedAt ?? new Date(0).toISOString(),
      money_type: result.payload.pendingP2PInfo.moneyPriorit ?? 'unknown',
      sender_name: result.payload.sender.displayName ?? 'unknown',
      sender_external_id: result.payload.sender.externalId ?? 'unknown',
      photo_url: result.payload.sender.photoUrl ?? 'unknown',
      raw: result,
    }
  } catch (_e) {
    return {
      success: false,
      message: parseResultMessage(result),
      orderId: 'unknown',
      orderType: 'unknown',
      description: 'unknown',
      imageUrl: 'unknown',
      amount: 0,
      link: 'unknown',
      isSetPasscode: false,
      createdAt: new Date(0).toISOString(),
      acceptedAt: new Date(0).toISOString(),
      money_type: 'unknown',
      sender_name: 'unknown',
      sender_external_id: 'unknown',
      photo_url: 'unknown',
      raw: result,
    }
  }
}

export function parseReceiveLink(result: Anyone, success: boolean): ResponseReceiveLink {
  try {
    return {
      success: success && isSuccess(result),
      message: parseResultMessage(result),
      messageId: result.payload.messageId ?? 'unknown',
      chatRoomId: result.payload.chatRoomId ?? 'unknown',
      orderStatus: result.payload.orderStatus ?? 'unknown',
      raw: result,
    }
  } catch (_e) {
    return {
      success: false,
      message: parseResultMessage(result),
      messageId: 'unknown',
      chatRoomId: 'unknown',
      orderStatus: 'unknown',
      raw: result,
    }
  }
}

export function parseAny(result: Anyone, success: boolean): ResponseAnyone {
  try {
    return {
      success: success && isSuccess(result),
      message: parseResultMessage(result),
      raw: result,
    }
  } catch (_e) {
    return {
      success: false,
      message: parseResultMessage(result),
      raw: result,
    }
  }
}
