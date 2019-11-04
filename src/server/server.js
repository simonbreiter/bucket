require('dotenv').config()

const express = require('express')
const graphqlHTTP = require('express-graphql')
const port = process.env.API_PORT
const app = express()
const { buildSchema } = require('../graphql/schema')

app.use(
  '/',
  graphqlHTTP(async (req, res) => ({
    // build new schema on each request, so we can modify it at runtime
    schema: buildSchema(),
    graphiql: true
  }))
)

if (process.env.ENV !== 'dev') {
  app.listen(port, () => console.log(`Server runs on port ${port}!`))
}

module.exports = app
