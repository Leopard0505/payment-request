import PaymentRequestMethod from '../src/client/index'

const params = {
  url: '/pay',
  stripe_pk_key: 'public_stripe_pk_key'
}
const displayItems = [
  {
    label: 'First Item',
    amount: { currency: 'JPY', value: '1000' }
  },
  {
    label: 'Second Item',
    amount: { currency: 'JPY', value: '-200' }
  }
]

describe('PaymentRequestMethod', () => {
  const payment = new PaymentRequestMethod(params, displayItems)
  describe('constructor()', () => {
    it('constructor', () => {
      expect(payment.url).toBe('/pay')
      expect(payment.stripe_pk_key).toBe('public_stripe_pk_key')
    })
  })

  describe('calculation()', () => {
    const { amount } = payment.calculation(displayItems)
    test('amount#currency', () => {
      expect(amount.currency).toBe('JPY')
    })
    test('amount#value', () => {
      expect(amount.value).toBe(800)
    })
  })
  
  // describe('isPaymentRequest()', () => {
  //   test('isPaymentRequest()', () => {
  //     expect(payment.isPaymentRequest()).toBe(true)
  //   })
  // })

  // describe('')
})
