// PayPay Error Test
import { PayPayStatus } from '..'
import { PayPay } from '.'

describe('PayPayError', () => {
  const paypay = new PayPay('09019194545', 'ctkpaarR2')

  test('PayPay Fail', async () => {
    expect(await paypay.login()).toStrictEqual({
      success: false,
      status: PayPayStatus.LoginFailed,
    })
  })
})
