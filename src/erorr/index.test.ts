// PayPay Error Test
import { PayPayError } from '.'

describe('PayPayError', () => {
  const error = new PayPayError('test', 1)

  test('PayPayError Property', () => {
    expect(error.code).toBe(1)
    expect(error.message).toBe('test')
  })

  test('PayPayError Method', () => {
    try {
      throw error.fire()
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: Error | any) {
      expect(error.message).toBe('PayPaxError [1] : test')
    }
  })

  test('PayPayError Overflow Error Code', () => {
    const error = new PayPayError('test', -1)

    expect(error.code).toBe(0)
  })
})
