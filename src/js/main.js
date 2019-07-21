
import PaymentRequestMethod from './payment-request-method.js'

const stripeButton = document.getElementById('stripe-button')
stripeButton.addEventListener('click', () => {
  const params = {
    url: '/pay',
    currency: 'JPY',
    stripe_pk_key: 'pk_test_m9n8fuq9aylLpjS4XyU2Bfj300SuujXxCV'
  }
  const displayItems = [
    {
      label: '商品A',
      amount: { currency: 'JPY', value: 1000 }
    },
    {
      label: '割引き',
      amount: { currency: 'JPY', value: -200 }
    }
  ]
  const payment = new PaymentRequestMethod(params, displayItems)
  payment.pay()
})
