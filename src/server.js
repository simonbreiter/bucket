const express = require('express')
const port = process.env.PORT || 3000
const app = express()

app.get('/', (req, res) => {
  res.status(200).send('Hello World!')
})

if (!process.env.TESTING) {
  app.listen(port, () => console.log(`Server runs on port ${port}!`))
}

module.exports = app
