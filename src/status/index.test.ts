// PayPay Status Test
import { PayPayStatus } from './index'

describe('Status', () => {
  test('not include space', () => {
    for (const Status of Object.values(PayPayStatus)) {
      expect(Status).not.toMatch(/\s/)
    }
  })
})
