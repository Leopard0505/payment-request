/**
 * 必要
 * 　商品情報
 * 　支払いができる
 */
module.exports = class {
  constructor(params, displayItems) {
    if (!displayItems) throw new Error('found not displayItems')

    // API URL
    this.URL = params.URL ? params.URL : '/pay'

    // Supported payment methods
    this.supportedInstruments = [
      {
        supportedMethods: ['basic-card'],
        data: {
          supportedNetworks: [
            'visa',
            'mastercard',
            'amex',
            'discover',
            'diners',
            'jcb',
            'unionpay'
          ]
        }
      }
    ]

    this.currency = params.currency ? params.currency : 'JPY'
    // Checkout details
    this.details = {
      displayItems: displayItems,
      total: this.calculation(displayItems)
    }
  }

  /** calculation */
  calculation(items) {
    const total = {
      label: 'Total',
      amount: { currency: this.currency, value: '0.00' }
    }
    
    const values = items.map(p => {
      return parseInt(p.amount.value)
    })

    const value = values.reduce((prev, current) => prev + current)
    
    total.amount.value = value

    return total
  }

  /** process pyament request */
  async pay() {
    if (!window.PaymentRequest) {
      // PaymentRequest API is not available. Forwarding to
      // legacy form based experience.
      location.href = '/checkout'
      return
    }

    // 1. Create a `PaymentRequest` instance
    // 1. `PaymentRequest` インスタンスを生成する
    const request = new PaymentRequest(this.supportedInstruments, this.details)

    // 2. Show the native UI with `.show()`
    // 2. `.show()` を呼び出して、ネイティブ UI を表示する
    const result = await request.show().catch(error => { console.error('await/catch', error.message); return })
    if (!result) return
    
    // 3. Process the payment
    // 3. 決済処理をおこなう
    // POST the payment information to the server
    try {
      const response = await fetch(`${this.URL}`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(result.toJSON())
      })
      // 4. Display payment results
      // 4. 決済結果を表示する
      if (response.status === 200) {
        // Payment successful
        return result.complete('success')
      } else {
        // Payment failure
        console.error('status: ', response.status)
        return result.complete('fail')
      }
    } catch (error) {
      console.error('try/catch', error.message)
      return result.complete('fail')
    }
  }
}
