# PayPaxとは？

まず初めに、このドキュメントは日本語で書かれています。PayPayは日本のサービスなので、問題ないでしょう（多分）。

**PayPax**は、[PayPay](https://paypay.ne.jp)を**Node.js**や**Deno**、**Bun**から操作できるようにしたOSSライブラリです。ぜひ[リポジトリ](https://github.com/EdamAme-x/paypax)のスターをお願いします！

## リンク集
リポジトリ: [https://github.com/EdamAme-x/paypax]  
問題・バグ報告用: [https://github.com/EdamAme-x/paypax/issues]  
質問用: [https://github.com/EdamAme-x/paypax/discussions]  
開発者: [https://github.com/EdamAme-x]  
Twitter: [https://twitter.com/amex2189]  
Website: [https://ame-x.net]  

## 予備知識
この**Docs**では、**Deno**を前提に説明します。ただし、**Deno**と**Node.js**にはある程度互換性がありますので、以下に上げる事以外はほぼ同じです。

### 標準入力の受け取り方
**Deno**では、`prompt("who are you? : ")`で簡単に受け取れますが、**Node.js**は**readline**等のモジュールを使う必要があります。分からなければ調べれば一発で出ます。

### Top level await
今回のコードでは例のために最低限の動作を見せます。そのため、

```typescript
await paypay.login(...);
```

このような書き方をしていますが、実際は**async**で包んだりする必要があります。ただし、**Deno**ではTop level awaitが使えるのでサンプルそのままで使えます。

練習は、**Deno**がおススメです。

## インストールしよう

```shell
npm i --save-dev paypax
or
yarn add -D paypax
or
pnpm i -save-dev paypax
or
bun i -D paypax
```

**Node.js**や**Bun**は以上のコマンドのいずれかでインストールできます。

**Deno**は

```typescript
import { PayPay } from "https://deno.land/x/paypax/mod.ts"
...
```

このように書くか、`deno.json`の**imports**に
```json
"imports": {
    "paypax": "https://deno.land/x/paypax/mod.ts"
}
```

を指定してあげてください。

これでコード内からどちらも

```ts
import { PayPay } from "paypax";
```

このように書くことができるようになりました。ただし、これは**esm**での話で、**commonjs** (require)を使っている場合は話が変わりますが、今時**commonjs**を使っているのは変態しかいないので大丈夫でしょう。

## ログインしよう

まずは基本から自分のアカウントにログインしてみましょう。必要なのは電話番号とパスワード、そして**OTP**を入力する機構だけです。

```typescript
import { PayPay } from 'paypax'
import { PayPayStatus } from 'paypax'

const paypay = new PayPay('電話番号', 'パスワード')
const result = await paypay.login() // ログインを実行　後述するがここにuuidもしくはtokenを入れるとOTP無しでログイン可能
console.log(result)

if (result.status === PayPayStatus.LoginNeedOTP) { // OTP が必要というステータスが返る
    const otp = prompt('Enter OTP: ' + paypay.otp.otp_prefix + '-') // OTP を入力するように求める
    console.log(await paypay.otpLogin(otp ?? '')) // OTP を引数に実行
    console.log(await paypay.getBalance()) // 残高確認
}
```

これでログインできます！実行すると、電話番号のSMSに四桁のOTP(確認コード)が送信されるので、それを入力してログインすることができます。

そして `await paypay.getBalance()` で自分の残高を確認できます。

ちなみに何度連続的にログインしても制限には、ひっかからないようにしているので安心してデバッグして下さい！

### コードの基本

```typescript
import { PayPay } from 'paypax'
import { PayPayStatus } from 'paypax'
```

ここで色々importしています。

**PayPay**はアプリを管理する本体です。
**PayPayStatus**は様々なステータスが入ったオブジェクトです。
**PayPayStatus**を使う事でログインに成功したんだな、失敗したんだな、OTP が必要なんだな、などのステータスを確認できます。

その部分がここです。
`if (result.status === PayPayStatus.LoginNeedOTP) { // OTP が必要というステータスが返る`

これだけでログインできます。
またリカバリという一意の文字列を生成し、それだけで簡単にインスタンスを再起動できる機能もありますが説明が難しいので**disscus**で聞いてください！
これを利用すると、この一意の文字列をcookieに入れて、Web版PayPayを作るのようなことができます。

## どんなメソッドがあるの
大体のことが出来ます。
機能追加の**PR**や、要望は**disscus**まで。

### getBalance

残高を確認するメソッドです。
```typescript
console.log(await paypay.getBalance())
```

### getUserInfo
自分の情報を取得するメソッドです。
```typescript
console.log(await paypay.getUserInfo())
```

### getLink
受け取りリンクの詳細を取得するメソッドです。
```typescript
console.log(await paypay.getLink("https://pay.paypay.ne.jp/~"))
```

### receiveLink
受け取りリンクから残高を受け取るメソッドです。
```typescript
console.log(await paypay.receiveLink("https://pay.paypay.ne.jp/~"))
```

### sendMoney
金額を送金するメソッドです。
送金するには相手とフレンドである必要があります。

```typescript
console.log(await paypay.sendMoney(金額, "external_id"))
```

`external_id`は、`getLink`や`getUserInfo`で得られる`external_id`と同様です。
相手の`external_id`を指定します。

### createLink
リンクを作成するメソッドです。
```typescript
console.log(await paypay.createLink(金額, "パスコード四桁"))
```

パスコード四桁を指定しなければ、パスコード無しのリンクが作成されます。

### request
詳しくはリポジトリの`example`ディレクトリを見てください。
最近の取引の履歴等を引き出せます。

```typescript
console.log(await paypay.request("getPay2BalanceHistory"))
console.log(await paypay.request("エンドポイント"))
```

### rejectLink
受け取りリンクを拒否するメソッドです（あまり使わないと思いますが）。

```typescript
console.log(await paypay.rejectLink("https://pay.paypay.ne.jp/~"))
```

## その他役に立つメソッド

### recoveryCode

```typescript
const recoveryCode = await paypay.getRecoveryCode()

    try {
        const paypay2 = await new PayPayRecovery(recoveryCode).recovery()
        console.log(await paypay2.getBalance())
    }catch (_e) {
        console.log('Recovery failed!!!')
        console.log(_e)
    }
```

`recoveryCode`さえcookieなり、jsonファイルなり、DBなりなんなりに保存しておけば、すぐにセッションを復活できます。
これにより、様々なアプリケーションを実現可能です。

ここに書いてないけど、こういうこと出来ないの？というのは**Disscus**で全てお願いします。
