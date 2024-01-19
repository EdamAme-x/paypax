export class PayPayError {
  public message: string = 'Unknown'
  public code: number = 0

  constructor(message: string, code: number) {
    if (code >= 0) {
      this.message = message
      this.code = code
    }
  }

  fire() {
    const { message, code } = this
    throw new Error(`PayPayError [${code}] : ${message} from paypax`)
  }
}
