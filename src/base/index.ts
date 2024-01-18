import { PayPayError, isPassword, isPhone, isUuid } from '..'

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
            if (isPassword(password)) {
                this.phone = phone
                this.password = password

                if (uuid) {
                    if (isUuid(uuid)) {
                        this.uuid = uuid
                    }else {
                        new PayPayError('UUID is not valid', 0)
                    }
                }
            }else {
                new PayPayError('Password is not valid', 0)
            }
        }else {
            new PayPayError('Phone is not valid', 0)
        }
    }
}