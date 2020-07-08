const { GraphQLObjectType, GraphQLSchema } = require('graphql')
const { userQueries } = require('../graphql/user/queries')
const { userMutations } = require('../graphql/user/mutations')

/**
 * Builds and returns new schema
 */
const buildSchema = query => {
  return new GraphQLSchema({
    query: new GraphQLObjectType({
      name: 'Query',
      description: 'Possible queries',
      fields: {
        ...userQueries
      }
    }),
    mutation: new GraphQLObjectType({
      name: 'Mutation',
      description: 'Possible mutations',
      fields: {
        ...userMutations
      }
    })
  })
}

module.exports = {
  buildSchema
}
