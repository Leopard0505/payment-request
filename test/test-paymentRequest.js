import test from 'ava'
import paymentRequest from '../index'

const params = {
  URL: '/pay'
}
const displayItems = [
  {
    label: 'First Item',
    amount: { currency: 'JPY', value: '1000.00' }
  },
  {
    label: 'Second Item',
    amount: { currency: 'JPY', value: '-200.00' }
  }
]

test('paymentRequest#new', t => {
  const payment = new paymentRequest(params, displayItems)
  t.is(payment.URL, params.URL)
})
