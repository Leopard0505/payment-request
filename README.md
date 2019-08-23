# payment-request
This is a program for payment request on client side.

## Usage
First, install this module in your project.
```console
$ npm install @leopard0505/payment-request
```
or
```console
$ yarn add @leopard0505/payment-request
```

Import this module in your source code and call like below.
```JavaScript
import PaymentRequestMethod from '@leopard0505/payment-request'

const payment = new PaymentRequestMethod(displayItems)
payment.pay().then(/* ... */).catch(/* ... */)
```
or
```JavaScript
import PaymentRequestMethod from '@leopard0505/payment-request'

const params = { /* ... */ }
const payment = new PaymentRequestMethod(params, displayItems)
payment.pay().then(/* ... */).catch(/* ... */)
```

## Args
default
```JavaScript
const params = {
  url: 'pay',
  currency: 'JPY',
  stripe_pk_key: 'YOUR_PUBLISHABLE_STRIPE_API_KEY'
}

const displayItems = [
  {
    label: 'Original donation amount',
    amount: { currency: 'JPY', value: '1080' }
  },
  {
    label: 'Friends and family discount',
    amount: { currency: 'JPY', value: '-108' }
  }
]
```

## Local
ローカルで実行する場合はコンソールを2つ用意する
以下のコマンドを実行する

ファイル変更を検知してwebpackでバンドルする
```bash
$ yarn dev
```
ローカルサーバーを起動する
```bash
$ yarn server
```

## Test
```bash
$ yarn test
```


## License
This software is released under the MIT License, see LICENSE.txt.
