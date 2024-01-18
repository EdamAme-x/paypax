// PayPay Error Test
import * as util from './parse.ts'

describe('Util', () => {
  test('parseCookieFromMap', () => {
    const map = new Map([
      ['key1', 'value1'],
      ['key2', 'value2'],
    ])

    expect(util.parseCookieFromMap(map)).toBe('key1=value1; key2=value2')
  })
})
