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

const payment = new paymentRequest()
```
or
```JavaScript
import paymentRequest from '@leopard0505/payment-request'

const params = { /* ... */ }
const payment = new paymentRequest(params)
```

## params
default
```JavaScript
const params = {
  URL: 'pay'
}
```


## License
This software is released under the MIT License, see LICENSE.txt.
