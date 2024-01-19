// https://deno.land/x/paypax/mod.ts に書き換える
import { PayPay, PayPayRecovery } from '../deno_dist/mod.ts'
import { PayPayStatus } from '../deno_dist/mod.ts'

const paypay = new PayPay('09019194545', 'p@ssw0rd')
const result = await paypay.login()
console.log(result)

if (result.status === PayPayStatus.LoginNeedOTP) {
    const otp = prompt('Enter OTP: ' + paypay.otp.otp_prefix + '-')
    console.log(await paypay.otpLogin(otp ?? ''))
    console.log(await paypay.getBalance())
    console.log(await paypay.getUserInfo())
    console.log(await paypay.createLink(1, '1234'))
    console.log(await paypay.getLink('https://pay.paypay.ne.jp/~'))
    console.log(await paypay.receiveLink('https://pay.paypay.ne.jp/~'))
    console.log(await paypay.request('getPay2BalanceHistory'))
    console.log(await paypay.request('getPaymentMethodList'))
    console.log(await paypay.request('getProfileDisplayInfo'))
    console.log(await paypay.sendMoney(1, 'external_id'))
    console.log(await paypay.rejectLink('https://pay.paypay.ne.jp/~'))
    const recoveryCode = await paypay.getRecoveryCode()

    try {
        const paypay2 = await new PayPayRecovery(recoveryCode).recovery()
        console.log(await paypay2.getBalance())
    }catch (_e) {
        console.log('Recovery failed!!!')
        console.log(_e)
    }
}
