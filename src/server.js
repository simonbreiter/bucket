const express = require('express')
const graphqlHTTP = require('express-graphql')
const {
  buildSchema,
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLInt,
  GraphQLString
} = require('graphql')

const port = process.env.PORT || 3000
const app = express()

// Resolver
const hello = () => 'Hello world!'

// Schema
const schema = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'Query',
    description: 'Possible queries',
    fields: {
      hello: {
        type: GraphQLString,
        resolve: hello
      }
    }
  })
})

app.use(
  '/graphql',
  graphqlHTTP({
    schema: schema,
    graphiql: !process.env.TESTING
  })
)

app.get('/', (req, res) => {
  res.status(200).send('Hello World!')
})

if (!process.env.TESTING) {
  app.listen(port, () => console.log(`Server runs on port ${port}!`))
}

module.exports = app
