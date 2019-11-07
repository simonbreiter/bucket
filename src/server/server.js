require('dotenv').config()

const express = require('express')
const graphqlHTTP = require('express-graphql')
const port = process.env.API_PORT
const app = express()
const { buildSchema } = require('../graphql/schema')
const { connectToDB } = require('../db/db')

app.use(
  '/',
  graphqlHTTP(async (req, res) => {
    const connection = await connectToDB()
    return {
      // build new schema on each request, so we can modify it at runtime
      schema: buildSchema(),
      context: {
        connection: await connection,
        db: await connection.db('mydb')
      },
      graphiql: true
    }
  })
)

if (process.env.ENV !== 'dev') {
  app.listen(port, () => console.log(`Server runs on port ${port}!`))
}

module.exports = app
