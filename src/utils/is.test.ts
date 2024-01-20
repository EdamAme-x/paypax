// PayPay is Test
import * as util from './is'

describe('Util', () => {
  test('isPhone', () => {
    const validPhone = '09019194545'
    const invalidPhone = '0901919404'
    const invalidPhone2 = '0a019194545'
    expect(util.isPhone(validPhone)).toBeTruthy()
    expect(util.isPhone(invalidPhone)).toBeFalsy()
    expect(util.isPhone(invalidPhone2)).toBeFalsy()
  })

  test('isPassword', () => {
    const validPassword = 'Aa123456'
    const invalidPassword = '123a6'
    const invalidPassword2 = 'helloworld'
    expect(util.isPassword(validPassword)).toBeTruthy()
    expect(util.isPassword(invalidPassword)).toBeFalsy()
    expect(util.isPassword(invalidPassword2)).toBeFalsy()
  })

  test('isUuid', () => {
    const validUuid = '12345678-1234-1234-1234-123456789012'
    const invalidUuid = '12345678-1234-1234-1234-12345678901'
    const invalidUuid2 = '12345678-1234-1234-1234-1234567890'
    expect(util.isUuid(validUuid)).toBeTruthy()
    expect(util.isUuid(invalidUuid)).toBeFalsy()
    expect(util.isUuid(invalidUuid2)).toBeFalsy()
  })

  test('isSuccess', () => {
    const validSuccess = {
      header: {
        resultCode: 'S0000',
        resultMessage: 'Success',
      },
      payload: {
        paypay: 'resultCode',
        oosugi: 'dounikashite',
      },
    }

    const invalidSuccess = {
      header: {
        resultCode: 'S0001',
        resultMessage: 'Invalid anyone',
      },
      payload: {
        paypay: 'resultCode',
        oosugi: 'dounikashite',
      },
    }

    expect(util.isSuccess(validSuccess)).toBeTruthy()
    expect(util.isSuccess(invalidSuccess)).toBeFalsy()
  })
})
