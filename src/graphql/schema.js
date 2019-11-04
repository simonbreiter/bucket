const {
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLInt,
  GraphQLList,
  GraphQLString
} = require('graphql')
const {
  MongoClient,
  ObjectId,
  MongoError,
  mongoErrorContextSymbol
} = require('mongodb')

const { userResolver, usersResolver } = require('../graphql/user/queries')
const { createUserResolver } = require('../graphql/user/mutations')
const { userType } = require('../graphql/user/type')

// Queries
const queries = {
  user: {
    type: userType,
    args: {
      _id: {
        type: GraphQLString
      }
    },
    resolve: userResolver
  },
  users: {
    type: GraphQLList(userType),
    resolve: usersResolver
  }
}

// mutations
const mutations = {
  createUser: {
    type: userType,
    args: {
      name: {
        type: GraphQLString
      }
    },
    resolve: createUserResolver
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

module.exports = {
  buildSchema
}
