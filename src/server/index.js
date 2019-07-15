const consola = require('consola')
const express = require('express')
const app = express()

const port = 3000

app.use(express.static('src/client'))

app.listen(port, () => {
  consola.success('Server running...')
})
