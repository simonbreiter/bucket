const express = require('express')
const graphqlHTTP = require('express-graphql')
const {
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLInt,
  GraphQLString
} = require('graphql')

const port = process.env.PORT || 3000
const app = express()

// Resolver
const hello = () => 'Hello world!'
const hello2 = () => 'Hello world!2'
const foo = (_, { bar }) => {
  return bar
}

let queries = {
  hello: {
    type: GraphQLString,
    resolve: hello
  }
}

let mutations = {
  createFoo: {
    type: GraphQLString,
    args: {
      bar: {
        type: GraphQLString
      }
    },
    resolve: foo
  }
}

/**
 * Builds and returns new schema
 */
const buildSchema = () =>
  new GraphQLSchema({
    query: new GraphQLObjectType({
      name: 'Query',
      description: 'Possible queries',
      fields: queries
    }),
    mutation: new GraphQLObjectType({
      name: 'Mutation',
      description: 'Possible mutations',
      fields: mutations
    })
  })

app.use(
  '/',
  graphqlHTTP(async (req, res) => ({
    schema: buildSchema(),
    graphiql: !process.env.TESTING
  }))
)

queries.hello2 = {
  type: GraphQLString,
  resolve: hello2
}

if (!process.env.TESTING) {
  app.listen(port, () => console.log(`Server runs on port ${port}!`))
}

module.exports = app
