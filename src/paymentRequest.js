/**
 * 必要
 * 　商品情報
 * 　支払いができる
 */
module.exports = class {
  constructor(params) {
    // API URL
    this.URL = params.URL || '/pay'

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
    // Checkout details
    this.details = {
      displayItems: [
        {
          label: 'Original donation amount',
          amount: { currency: 'USD', value: '65.00' }
        },
        {
          label: 'Friends and family discount',
          amount: { currency: 'USD', value: '-10.00' }
        }
      ],
      total: {
        label: 'Total',
        amount: { currency: 'USD', value: '55.00' }
      }
    }
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
    const request = new PaymentRequest(supportedInstruments, details)

    // 2. Show the native UI with `.show()`
    // 2. `.show()` を呼び出して、ネイティブ UI を表示する
    const result = await request.show()

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
        return result.complete('fail')
      }
    } catch (e) {
      return result.complete('fail')
    }
  }
}
