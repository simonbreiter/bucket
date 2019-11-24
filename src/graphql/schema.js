const { GraphQLObjectType, GraphQLSchema } = require('graphql')
const { bucketMutations } = require('../graphql/bucket/mutations')
const { userMutations } = require('../graphql/user/mutations')
const { userQueries } = require('../graphql/user/queries')

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
        ...userMutations,
        ...(query.graphql.function === 'createBucket'
          ? bucketMutations(query)
          : {})
      }
    })
  })
}

module.exports = {
  buildSchema
}
