// PayPay Error Test
import { PayPayError } from './index.ts'

describe('PayPayError', () => {
  const error = new PayPayError('test', 1)

  test('PayPayError Property', () => {
    expect(error.code).toBe(1)
    expect(error.message).toBe('test')
  })

  test('PayPayError Method', () => {
    try {
      error.fire()
    } catch (error: Error | any) {
      expect(error.message).toBe('PayPayError [1] : test from paypay.x.js')
    }
  })

  test('PayPayError Overflow Error Code', () => {
    const error = new PayPayError('test', -1)

    expect(error.code).toBe(0)
  })
})
