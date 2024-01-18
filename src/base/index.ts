import { PayPayError, isPhone } from '..'

export class PayPay {
    phone: string = ''
    password: string = ''
    uuid: string | undefined

    // is Logged
    logged: boolean = false

    constructor(
        phone: string,
        password: string,
        uuid?: string
    ) {
        if (isPhone(phone)) {
            this.phone = phone
            this.password = password
            this.uuid = uuid
        }else {
            new PayPayError('Phone is not valid', 0)
        }
    }
}