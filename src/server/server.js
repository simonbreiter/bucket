require('dotenv').config()

const express = require('express')
const graphqlHTTP = require('express-graphql')
const {
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLInt,
  GraphQLList,
  GraphQLString
} = require('graphql')

const port = process.env.API_PORT
const app = express()

const fakeDatabase = {
  a: {
    id: 'a',
    name: 'alice'
  },
  b: {
    id: 'b',
    name: 'bob'
  }
}

// Types
const userType = new GraphQLObjectType({
  name: 'User',
  fields: {
    id: {
      type: GraphQLString
    },
    name: {
      type: GraphQLString
    }
  }
})

// Resolver
const userResolver = (_, { id }) => fakeDatabase[id]

// Queries
const queries = {
  user: {
    type: userType,
    args: {
      id: {
        type: GraphQLString
      }
    },
    resolve: userResolver
  },
  users: {
    type: GraphQLList(userType),
    resolve: function () {
      return Object.keys(fakeDatabase).map(el => {
        return {
          id: fakeDatabase[el].id,
          name: fakeDatabase[el].name
        }
      })
    }
  }
}

// mutations
const mutations = {
  createUser: {
    type: userType,
    args: {
      id: {
        type: GraphQLString
      },
      name: {
        type: GraphQLString
      }
    },
    resolve: (_, { id, name }) => {
      const user = {
        id: id,
        name: name
      }
      // Update Database
      return user
    }
  }
  // createUser: (id, name) => {
  //   const newUser = {
  //     id: id,
  //     name: name
  //   }
  //   return fakeDatabase[id].newUser
  // }
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
    // build schema on every request, so we can modify schema at runtime
    schema: buildSchema(),
    graphiql: !!process.env.TESTING
  }))
)

if (!!process.env.TESTING) {
  app.listen(port, () => console.log(`Server runs on port ${port}!`))
}

module.exports = app
