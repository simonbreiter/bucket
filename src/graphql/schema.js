const { GraphQLObjectType, GraphQLSchema } = require('graphql')

const { mutations } = require('../graphql/user/mutations')
const { queries } = require('../graphql/user/queries')

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
