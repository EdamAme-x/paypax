export class PayPayError {
  public message: string = 'Unknown'
  public code: number = 0

  constructor(message: string, code: number) {
    if (code >= 0) {
      this.message = message
      this.code = code
    }
  }

  fire(): Error {
    const { message, code } = this
    return new Error(`PayPaxError [${code}] : ${message}`)
  }
}
