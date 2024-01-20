// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { PayPayStatus } from './status/index'
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Anyone = any

export type baseHeader = {
  Accept: string
  'User-Agent': string
  'Content-Type': string
}

export type loginResultStatus = keyof typeof PayPayStatus

export type loginResult = {
  success: boolean
  // { a:1, b:2 } => a|b
  status: loginResultStatus
}

export type OTP = {
  waiting: boolean
  otp_prefix: string
  otp_ref_id: string
}

export type LoginContext = {
  uuid?: string
  token?: string
}

export type CreateLinkContext = {
  androidMinimumVersion: string
  requestId: string
  requestAt: string
  theme: string
  amount: number
  iosMinimumVersion: string
  passcode?: string
}

export type ReceiveLinkContext = {
  verificationCode: string
  client_uuid: string
  passcode: string
  requestAt: string
  requestId: string
  orderId: string
  senderMessageId: string
  senderChannelUrl: string
  iosMinimumVersion: string
  androidMinimumVersion: string
}

export type SendMoneyContext = {
  theme: string
  externalReceiverId: string
  amount: number
  requestId: string
  requestAt: string
  iosMinimumVersion: string
  androidMinimumVersion: string
}

export type FetchContext = {
  method: 'POST' | 'GET' | 'DELETE' | 'PUT' | 'PATCH' | 'OPTIONS' | 'HEAD' | 'TRACE' | 'CONNECT'
  body?: string
}

export type ResponseBody = Anyone & {}

export type ResponseFail = {
  success: false
  status: string
}

export type ResponseBalance = {
  success: boolean
  message: string
  total: number
  currency: 'JPY' | string
  updated_at: string
  raw: {
    header: {
      resultCode: string
      resultMessage: string
    }
    payload: {
      [key: string]: Anyone
    }
  }
}

export type ResponseUserInfo = {
  success: boolean
  message: string
  id: number
  user_id: string
  state: string
  first_name: string
  last_name: string
  display_name: string
  icon_url: string
  phone_number: string
  email: string
  date_of_birth: string
  external_id: string
  raw: {
    header: {
      resultCode: string
      resultMessage: string
    }
    payload: {
      [key: string]: Anyone
    }
  }
}

export type ResponseCreateLink = {
  success: boolean
  message: string
  orderId: string
  orderStatus: string
  link: string
  transactionAt: string
  expiry: string
  raw: {
    header: {
      resultCode: string
      resultMessage: string
    }
    payload: {
      [key: string]: string
    }
  }
}

export type ResponseGetLink = {
  success: boolean
  message: string
  orderId: string
  orderType: string
  description: string
  imageUrl: string
  amount: number
  link: string
  isSetPasscode: boolean
  createdAt: string
  acceptedAt: string
  money_type: string
  sender_name: string
  sender_external_id: string
  photo_url: string
  raw: {
    header: {
      resultCode: string
      resultMessage: string
    }
    payload: {
      [key: string]: Anyone
    }
  }
}

export type ResponseReceiveLink = {
  success: boolean
  message: string
  messageId: string
  chatRoomId: string
  orderStatus: string
  raw: {
    header: {
      resultCode: string
      resultMessage: string
    }
    payload: {
      [key: string]: Anyone
    }
  }
}

export type ResponseAnyone = {
  success: boolean
  message: string
  raw: {
    header: {
      resultCode: string
      resultMessage: string
    }
    payload: {
      [key: string]: Anyone
    }
  }
}
