# payment-request
This is a program for payment request on client side.

## usage
First, install this module in your project.
```console
$ npm install @leopard0505/payment-request
```

Import this module in your source code and call like below.
```JavaScript
import paymentRequest from '@leopard0505/payment-request'

const payment = new paymentRequest(displayItems)
payment.pay().then(/* ... */).catch(/* ... */)
```
or
```JavaScript
import paymentRequest from '@leopard0505/payment-request'

const params = { /* ... */ }
const payment = new paymentRequest(params, displayItems)
payment.pay().then(/* ... */).catch(/* ... */)
```

## args
default
```JavaScript
const params = {
  URL: 'pay',
  currency: 'JPY',
  PUBLISHABLE_STRIPE_API_KEY: 'YOUR_PUBLISHABLE_STRIPE_API_KEY'
}

const displayItems = [
  {
    label: 'Original donation amount',
    amount: { currency: 'JPY', value: '65.00' }
  },
  {
    label: 'Friends and family discount',
    amount: { currency: 'JPY', value: '-10.00' }
  }
]
```


## License
This software is released under the MIT License, see LICENSE.txt.
