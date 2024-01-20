import type { Anyone } from '..'

/**
 * Determines if a phone number is valid.
 *
 * @param {string} phone - The phone number to validate.
 * @return {boolean} - True if the phone number is valid, false otherwise.
 *
 * @example
 * ```ts
 * isPhone('09019194545'); // returns true
 * isPhone('0901919404'); // returns false
 * isPhone('0a019194545'); // returns false
 * ```
 */
export function isPhone(phone: string): boolean {
  return /^0[1-9]0\d{8}$/.test(phone)
}

/**
 * Determines if a password is valid.
 *
 * @param {string} password - The password to validate.
 * @return {boolean} - True if the password is valid, false otherwise.
 *
 * @example
 * ```ts
 * isPassword('Aa123456'); // returns true
 * isPassword('123a6'); // returns false
 * isPassword('helloworld'); // returns false
 * ```
 */
export function isPassword(password: string): boolean {
  return /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)[A-Za-z\d]{6,32}$/.test(password)
}

/**
 * Determines if a UUID is valid.
 *
 * @param {string} uuid - The UUID to validate.
 * @return {boolean} - True if the UUID is valid, false otherwise.
 *
 * @example
 * ```ts
 * isUuid('12345678-1234-1234-1234-123456789012'); // returns true
 * isUuid('12345678-1234-1234-1234-12345678901'); // returns false
 * isUuid('12345678-1234-1234-1234-1234567890'); // returns false
 * ```
 */
export function isUuid(uuid: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/.test(uuid)
}

export function isSuccess(raw: {
  header: {
    resultCode: string
    resultMessage: string
  }
  payload: Anyone
}): boolean {
  try {
    return raw.header.resultCode === 'S0000'
  } catch (e) {
    return false
  }
}
