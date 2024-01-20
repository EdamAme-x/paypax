// PayPay Parse Test
import * as util from './parse'

describe('Util', () => {
  test('parseCookieFromMap', () => {
    const map = new Map([
      ['key1', 'value1'],
      ['key2', 'value2'],
    ])

    expect(util.parseCookieFromMap(map)).toBe('key1=value1; key2=value2')
  })

  test('parseRecoveryCode', () => {
    const phone = '09019194545'
    const password = 'ctkpaarR2'
    const uuid = 'a9b3d5c6-7d8e-9f0a-bcde-fghijk'

    expect(util.parseRecoveryCode(phone, password, uuid)).toBe(
      'eyJhbGcMDkwMTkxOTQ1NDU=.Y3RrcGFhclIy.YTliM2Q1YzYtN2Q4ZS05ZjBhLWJjZGUtZmdoaWpr'
    )
  })

  test('unparseRecoveryCode', () => {
    const code = 'eyJhbGcMDkwMTkxOTQ1NDU=.Y3RrcGFhclIy.YTliM2Q1YzYtN2Q4ZS05ZjBhLWJjZGUtZmdoaWpr'

    const { phone, password, uuid } = util.unparseRecoveryCode(code)

    expect(phone).toBe('09019194545')
    expect(password).toBe('ctkpaarR2')
    expect(uuid).toBe('a9b3d5c6-7d8e-9f0a-bcde-fghijk')
  })

  test('prase fail response', () => {
    const failResponse = {
      header: {
        resultCode: 'S0001',
        resultMessage: 'Invalid anyone',
      },
      payload: {
        paypay: 'resultCode',
        oosugi: 'dounikashite',
      },
    }

    expect(util.parseBalanceContext(failResponse, false)).toStrictEqual({
      success: false,
      message: 'Invalid anyone',
      total: 0,
      currency: 'JPY',
      updated_at: new Date(0).toISOString(),
      raw: failResponse,
    })
  })

  test('parse resultMessage', () => {
    const eg1 = {
      header: {
        resultCode: 'S0001',
        resultMessage: 'Example 1',
      },
      payload: {
        paypay: 'resultCode',
        oosugi: 'dounikashite',
      },
    }

    expect(util.parseResultMessage(eg1)).toBe('Example 1')

    const eg2 = {
      header: {},
      payload: {
        paypay: 'resultCode',
        oosugi: 'dounikashite',
      },
    }

    expect(util.parseResultMessage(eg2)).toBe('unknown')

    const eg3 = {}

    expect(util.parseResultMessage(eg3)).toBe('unknown')
  })
})
