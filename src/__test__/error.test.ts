// PayPay Error Test
import { PayPayError } from '../'

describe('PayPayError', () => {
    const error = new PayPayError('test', 1)

    test('fire', () => {
        expect(error.fire).toThrow('PayPayError: test [1] from paypay.x.js')
    })
})