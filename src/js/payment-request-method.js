import '../css/style.css'
import Stripe from 'stripe-client'
/**
 * 必要
 * 商品情報
 * 支払いができる
 */
export default class PaymentRequestMethod {

  /**
   * @constructor
   * @param { url: String, currency: String, stripe_pk_key: String } params 
   * @param { label: String, amount: { currency: String, value: number } } displayItems 
   */
  constructor(params, displayItems) {
    if (!displayItems) throw new Error('found not displayItems')

    const TypeErrorMessage = this.validateAmount(displayItems)
    if (TypeErrorMessage) throw new TypeError(TypeErrorMessage)

    // params
    this.url = params.url ? params.url : '/pay'
    this.currency = params.currency ? params.currency : 'JPY'
    // Stripe PK Key
    this.stripe_pk_key = params.stripe_pk_key ? params.stripe_pk_key : null

    this.stripe = new Stripe(this.stripe_pk_key)

    this.displayItems = displayItems

    // Supported payment methods
    this.supportedInstruments = [
      {
        supportedMethods: ['basic-card'],
        data: {
          supportedNetworks: ['visa', 'mastercard'], // 'amex','discover', 'diners', 'jcb', 'unionpay'
          supportedTypes: ["debit", "credit"],
        }
      },
      {
        supportedMethods: 'https://google.com/pay',
        data: {
          'environment': 'TEST',
          'apiVersion': 1,
          'allowedPaymentMethods': ['CARD', 'TOKENIZED_CARD'],
          'paymentMethodTokenizationParameters': {
            'tokenizationType': 'PAYMENT_GATEWAY',
            // Check with your payment gateway on the parameters to pass.
            'parameters': {}
          },
          'cardRequirements': {
            'allowedCardNetworks': ['AMEX', 'DISCOVER', 'MASTERCARD', 'VISA'],
            'billingAddressRequired': true,
            'billingAddressFormat': 'MIN'
          },
          'phoneNumberRequired': true,
          'emailRequired': true,
          'shippingAddressRequired': true
        },
      }
    ]

    this.shippingOptions = [
      {
        id: 'normal',
        label: '通常配送 (5-7日)',
        // selected: true,
        amount: {
          currency: 'JPY',
          value: 0,
        },
      }, {
        id: 'express',
        label: '速達配送 (2-3日)',
        amount: {
          currency: 'JPY',
          value: 500,
        },
      }, {
        id: 'next-day',
        label: '翌日配達',
        amount: {
          currency: 'JPY',
          value: 1000,
        },
      },
    ]

    // Checkout details
    this.details = {
      displayItems: displayItems,
      total: this.calculation(displayItems),
      shippingOptions: this.shippingOptions
    }

    // Options
    this.options = {
      requestPayerEmail: true,
      requestPayerName: true,
      requestPayerPhone: true,
      requestShipping: true,
      shippingType: 'delivery'
    }
  }

  /** calculation */
  calculation(items) {
    const total = {
      label: '合計',
      amount: { currency: this.currency, value: 0 }
    }
    
    const value = items
    .map(item => item.amount.value)
    .reduce((prev, current) => prev + current)
    
    total.amount.value = value

    return total
  }

  /** validate amount */
  validateAmount(items) {
    const regex = new RegExp('^-?[0-9]+(\.[0-9]+)?$')
    let errorMessage = ''
    items.forEach((item) => {
      if (!regex.test(item.amount.value)) errorMessage = '金額を10進数にしてください'
    })
    return errorMessage
  }

  /** checking use PaymentRequest on browser */
  isPaymentRequest() {
    if (!window.PaymentRequest) {
      // PaymentRequest API is not available. Forwarding to
      // legacy form based experience.
      location.href = '/checkout'
      return false
    }
    return true
  }

  /** process pyament request */
  async pay() {
    console.log('pay()')
    // 0. Check a `PaymentRequest` on browser
    // 0. `PaymentRequest` をブラウザで使用できるか確認する
    // if (this.isPaymentRequest()) return
    // console.log('isPaymentRequest()')
    
    // 1. Create a `PaymentRequest` instance
    // 1. `PaymentRequest` インスタンスを生成する
    const request = new PaymentRequest(this.supportedInstruments, this.details, this.options)
    console.log('new PaymentRequest()')

    // 0. Check user pay using Payment Request API
    // 0. 支払い要求APIを使用してユーザーの支払いを確認する
    // const supportsBasicCard = await request.canMakePayment()
    // if (supportsBasicCard) return
    // console.log('supportsBasicCard')

    // 0. Add event listener on `shippingaddresschange`
    // 0.
    request.addEventListener('shippingaddresschange', ev => {
      ev.updateWith(((details) => {
        // let shippingOption = {
        //   id: '',
        //   label: '',
        //   amount: { currency: 'JPY', value: 0 },
        //   selected: true
        // }
        // // Shipping to US is supported
        // if (addr.country === 'US') {
        //   shippingOption.id = 'us'
        //   shippingOption.label = 'Standard shipping in US'
        //   shippingOption.amount.value = 0
        //   details.total.amount.value = details.total.amount.value
        // // Shipping to JP is supported
        // } else if (addr.country === 'JP') {
        //   shippingOption.id = 'jp'
        //   shippingOption.label = 'International shipping'
        //   shippingOption.amount.value = 100
        //   details.total.amount.value += 100
        // // Shipping to elsewhere is unsupported
        // } else {
        //   // Empty array indicates rejection of the address
        //   details.shippingOptions = []
        //   return Promise.resolve(details)
        // }
        // // Hardcode for simplicity
        // if (details.displayItems.length === 2) {
        //   details.displayItems[2] = shippingOption
        // } else {
        //   details.displayItems.push(shippingOption)
        // }
        // details.shippingOptions = [shippingOption]
        
        return Promise.resolve(details)
      })(this.details))
    })

    // 0. Add event listener on `shippingoptionchange`
    // 0. 
    request.addEventListener('shippingoptionchange', ev => {
      // Step 1: Get the payment request object.
      const prInstance = event.target

      // Step 2: Get the ID of the selected shipping option.
      const selectedId = prInstance.shippingOption

      // Step 3: Mark selected option
      let selectedOption = null
      this.shippingOptions.forEach((option) => {
        if (option.id === selectedId) {
          option.selected = true
          selectedOption = option
        }
      })
      const newShippingOptions = this.displayItems.filter((item) => !item.id)
      newShippingOptions.push(selectedOption)

      ev.updateWith({
        displayItems: newShippingOptions,
        total: this.calculation(newShippingOptions),
        shippingOptions: this.shippingOptions,
      })
    })

    // 2. Show the native UI with `.show()`
    // 2. `.show()` を呼び出して、ネイティブ UI を表示する
    const result = await request.show().catch((err) => { console.error('PaymentRequest error: ', err); })
    if (!result) return

    const body = {
      amount: this.details.total.amount.value,
      currency: this.currency,
      source: null
    }
    if (this.stripe_pk_key) {
      // Stripe initialized and Stripe createToken

      const information = {
        card: {
          number: result.details.cardNumber,
          exp_month: result.details.expiryMonth,
          exp_year: result.details.expiryYear,
          cvc: result.details.cardSecurityCody,
          name: result.details.cardholderName
        }
      }

      const card = await this.stripe.createToken(information).then(response => response.json())
      const token = card.id

      body.source = token
    }
    
    // 3. Process the payment
    // 3. 決済処理をおこなう
    // POST the payment information to the server
    let status = ''
    try {
      const response = await fetch(`${this.url}`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
      })
      console.log(await response.json())
      // 4. Display payment results
      // 4. 決済結果を表示する
      status = response.ok ? 'success' : 'fail'
    } catch (error) {
      console.error('try/catch', error.message)
      status = 'fail'
    }
    return result.complete(status)
  }
}
