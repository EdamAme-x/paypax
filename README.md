[![GitHub Workflow Status](https://img.shields.io/github/actions/workflow/status/EdamAme-x/paypax/test.yml?branch=main)](https://github.com/EdamAme-x/paypax/actions)
[![GitHub](https://img.shields.io/github/license/EdamAme-x/paypax)](https://github.com/EdamAme-x/paypax/blob/main/LICENSE)
[![npm](https://img.shields.io/npm/v/paypax)](https://www.npmjs.com/package/paypax)
[![npm](https://img.shields.io/npm/dm/paypax)](https://www.npmjs.com/package/paypax)
[![Bundle Size](https://img.shields.io/bundlephobia/min/paypax)](https://bundlephobia.com/result?p=paypax)
[![Bundle Size](https://img.shields.io/bundlephobia/minzip/paypax)](https://bundlephobia.com/result?p=paypax)
[![npm type definitions](https://img.shields.io/npm/types/paypax)](https://www.npmjs.com/package/paypax)
[![GitHub commit activity](https://img.shields.io/github/commit-activity/m/EdamAme-x/paypax)](https://github.com/EdamAme-x/paypax/pulse)
[![GitHub last commit](https://img.shields.io/github/last-commit/EdamAme-x/paypax)](https://github.com/EdamAme-x/paypax/commits/main)
[![Deno badge](https://img.shields.io/endpoint?url=https%3A%2F%2Fdeno-visualizer.danopia.net%2Fshields%2Flatest-version%2Fx%2Fhono%2Fmod.ts)](https://doc.deno.land/https/deno.land/x/paypax/mod.ts)
[![Discord badge](https://img.shields.io/discord/1115195558743781408?label=Discord&logo=Discord)](https://discord.gg/ctkpaarr)
# PayPax
PayPay UnOffical api Rapper Library | Various PayPay operations can be automated, from login to balance transfer and confirmation.
Open Source Software 🎁

<img src="/docs/docs/public/favicon.png" width="200" height="200" alt="icon" />

can call it either **paypax** or **PayPax**.

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
pnpm add --save-dev paypax
or
bun add -D paypax
```

- Deno
```typescript
import { PayPay } from "https://deno.land/x/paypax/mod.ts"
...
```

## Docs
[https://edamame-x.github.io/paypax](https://edamame-x.github.io/paypax/)

[example](./example)

### Error 0番
ライブラリの初期化エラー
電話番号、パスワード、UUIDの形式の何れかが間違っている

### Error 1番
ライブラリのメソッドエラー
リンクが存在しない等

### Error 2番
初期化(ログイン)が終わっていないと実行できないメソッドを実行している。

### Error 3番
パースのエラー

## PullRequest
See [CONTRIBUTING.md](./CONTRIBUTING.md)

設計: [https://lucid.app/lucidchart/...](https://lucid.app/lucidchart/b936fcef-e748-436f-8a5a-7ea6cc454a2e/edit?viewport_loc=-11%2C-11%2C1480%2C723%2C0_0&invitationId=inv_11a8f8bf-5dbd-4a1e-9452-7b756d8a91ce)

Created by [@amex2189](https://ame-x.net)

Python版 元版: [https://github.com/taka-4602/PayPaython](https://github.com/taka-4602/PayPaython)
助言 Disocrd: @developerspartner 
