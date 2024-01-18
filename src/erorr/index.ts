export class PayPayError {
    constructor(
        private message: string,
        private code: number
    ) {}

    fire() {
        throw new Error(`PayPayError: ${this.message} [${this.code}] from paypay.x.js`)
    }
}