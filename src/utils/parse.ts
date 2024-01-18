import type { Anyone, ResponseBalance, ResponseCreateLink, ResponseUserInfo } from '..'

export function parseCookieFromMap(map: Map<string, string>): string {
  return Array.from(map.entries())
    .map(([key, value]) => `${key}=${value}`)
    .join('; ')
}

export function parseBalanceContext(result: Anyone): ResponseBalance {
  return {
    success: true,
    total: result.payload.walletSummary.allTotalBalanceInfo.balance,
    currency: result.payload.walletSummary.allTotalBalanceInfo.currency,
    updated_at: result.payload.updatedAt,
    raw: result,
  }
}

export function parseUserInfoContext(result: Anyone): ResponseUserInfo {
  return {
    success: true,
    id: result.payload.id,
    user_id: result.payload.user_defined_id ?? 'unknown',
    state: result.payload.state,
    first_name: result.payload.first_name,
    last_name: result.payload.last_name,
    display_name: result.payload.display_name,
    icon_url: result.payload.photo_url,
    phone_number: result.payload.mobile,
    email: result.payload.email,
    date_of_birth: result.payload.date_of_birth,
    raw: result,
  }
}

export function parseCreateLink(result: Anyone): ResponseCreateLink {
  return {
    success: true,
    orderId: result.payload.orderId,
    orderStatus: result.payload.orderStatus,
    link: result.payload.link,
    transactionAt: result.payload.transactionAt,
    expiry: result.payload.expiry,
    raw: result,
  }
}
