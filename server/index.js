const consola = require('consola')
const express = require('express')
const bodyParser = require('body-parser')
const app = express()

const port = 8080

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(express.static('public'))

app.post('/pay', async (req, res) => {
  try {
    const stripe = require('stripe')('sk_xxxxxxxxxxxxxxxxx')
    const result = await stripe.charges.create( req.body )
    return res.send(result)
  } catch (e) {
    console.error(e.message)
    return res.send(e)
  }
})

app.listen(port, () => {
  consola.success(`Server: http://localhost:${port}`)
})