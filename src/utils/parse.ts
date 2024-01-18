import type { ResponseBalance } from'..'

export function parseCookieFromMap(map: Map<string, string>): string {
  return Array.from(map.entries())
    .map(([key, value]) => `${key}=${value}`)
    .join('; ')
}

export function parseBalanceContext(result: any): ResponseBalance {
    return {
        success: true,
        total: result.payload.walletSummary.allTotalBalanceInfo.balance,
        currency: result.payload.walletSummary.allTotalBalanceInfo.currency,
        updated_at: result.payload.updatedAt,
        raw: result
    }
}