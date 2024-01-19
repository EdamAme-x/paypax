# PayPax
PayPay UnOffical api Rapper Library | Various PayPay operations can be automated, from login to balance transfer and confirmation.
Open Source Software 🎁

can call it either **PayPay.js** or **PayPax**.

for Node.js, Deno, Bun (all :) )

https://www.npmjs.com/package/paypax

## UseCase
- Cash dispenser
- PayPay for Web
- ... (and more)

### Features
- Fastest
- Multi Platform (Node.js, Deno, Bun...)
- Easy
- Strict Error
- feats
    - getBalance
    - getUserInfo
    - createLink
    - getLink
    - receiveLink
    - sendMoney
    - and more (History, payments...)

### Installation

- Node.js or Bun
```shell
npm i --save-dev paypax
or
yarn add -D paypax
or
pnpm i -save-dev paypax
or
bun i -D paypax
```

- Deno
```typescript
import { PayPay } from "https://deno.land/x/paypax/mod.ts"
...
```

## Docs
作者に聞くか  
[example](./example) ディレクトリのコードを見てください。

### Error 0番
ライブラリの初期化エラー
電話番号、パスワード、UUIDの形式の何れかが間違っている

### Error 1番
ライブラリのメソッドエラー
リンクが存在しない等

### Error 2番
初期化(ログイン)が終わっていないと実行できないメソッドを実行している。

## PullRequest
See [CONTRIBUTING.md](./CONTRIBUTING.md)

設計: [https://lucid.app/lucidchart/...](https://lucid.app/lucidchart/b936fcef-e748-436f-8a5a-7ea6cc454a2e/edit?viewport_loc=-11%2C-11%2C1480%2C723%2C0_0&invitationId=inv_11a8f8bf-5dbd-4a1e-9452-7b756d8a91ce)

Created by [@amex2189](https://ame-x.net)

Python版 元版: [https://github.com/taka-4602/PayPaython](https://github.com/taka-4602/PayPaython)
