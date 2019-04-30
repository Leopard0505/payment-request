import test from 'ava'
import paymentRequest from '../src/paymentRequest'

test('paymentRequest#new', t => {
  const params = {
    URL: '/pay'
  }
  const payment = new paymentRequest(params)
  t.is(payment.URL, params.URL)
})
