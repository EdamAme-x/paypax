// PayPay Status Test
import { PayPayStatus, statusof } from './index'

describe('Status', () => {
  test('not include space', () => {
    for (const Status of Object.values(PayPayStatus)) {
      expect(Status).not.toMatch(/\s/)
    }
  })

  test('not include undefined or null', () => {
    for (const Status of Object.values(PayPayStatus)) {
      expect(Status).not.toBeUndefined()
      expect(Status).not.toBeNull()
    }
  })

  test('statusof', () => {
    expect(statusof('LoginSuccess')).toBeTruthy()
    expect(statusof('LoginFailed')).toBeFalsy()
    expect(statusof('LoginDontNeedOTP')).toBeTruthy()
    expect(statusof('LoginAlreadySuccess')).toBeTruthy()
    expect(statusof('OTPLoginSuccess')).toBeTruthy()
    expect(statusof('OTPLoginFail')).toBeFalsy()
    expect(statusof('LoginIncorrectPassOrPhone')).toBeFalsy()
    expect(statusof('LoginNeedOTP')).toBeFalsy()
  })
})
