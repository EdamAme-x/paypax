export type baseHeader = {
  Accept: string
  'User-Agent': string
  'Content-Type': string
}

export type loginResult = {
  success: boolean
  status: string
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

export type FetchContext = {
  method: 'POST' | 'GET' | 'DELETE' | 'PUT' | 'PATCH' | 'OPTIONS' | 'HEAD' | 'TRACE' | 'CONNECT'
  body?: string
}

export type ResponseBody = any & {}

export type ResponseBalance = {
    success: true,
    total: number,
    currency: 'JPY' | string,
    updated_at: string,
    raw: {
        header: {
            resultCode: string,
            resultMessage: string
        },
        payload: {
            walletSummary: any,
            walletDetail: any,
            walletDescription: any,
            [key: string]: string | boolean
        }
    }
}