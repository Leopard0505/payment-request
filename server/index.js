const consola = require('consola')
const express = require('express')
const bodyParser = require('body-parser')
const app = express()

const port = 8080

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(express.static('public'))

app.post('/pay', (req, res) => {
  res.send(req.body)
})

app.listen(port, () => {
  consola.success(`Server: http://localhost:${port}`)
})