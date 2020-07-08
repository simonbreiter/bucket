require('dotenv').config()

const express = require('express')
const graphqlHTTP = require('express-graphql')
const port = process.env.API_PORT
const app = express()
const { buildSchema } = require('../graphql/schema')
const { attachConnection } = require('../middleware/attachConnection')
const { identifyUser } = require('../middleware/identifyUser')

app.use(attachConnection)
app.use(identifyUser)

// app.get('/schema', (req, res) => {
//   res.send('Hello world!')
// })

app.use(
  '/',
  graphqlHTTP(async (req, res) => {
    return {
      // build new schema on each request, so we can modify it at runtime
      schema: buildSchema(req.graphql),
      context: {
        connection: res.locals.connection,
        db: res.locals.db
      },
      graphiql: true
    }
  })
)

if (process.env.ENV !== 'dev') {
  app.listen(port, () => console.log(`Server runs on port ${port}!`))
}

module.exports = app
