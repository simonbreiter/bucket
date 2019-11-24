const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLFloat,
  GraphQLInt
} = require('graphql')

function createResolver (obj, args) {
  // TODO: Create collection in database
  return (obj, args) => ({
    ...args
  })
}

function createTypeConfig (args) {
  return {
    name: args[0].value,
    fields: args.reduce((acc, el) => {
      acc[el.name] = {
        type: GraphQLString
      }
      return acc
    }, {})
  }
}

function createArgs (args) {
  return args.reduce((acc, el) => {
    acc[el.name] = {
      type: GraphQLString
    }
    return acc
  }, {})
}

function bucketMutations (query) {
  return {
    createBucket: {
      type: new GraphQLObjectType(createTypeConfig(query.graphql.arguments)),
      args: createArgs(query.graphql.arguments),
      resolve: createResolver(query.graphql.arguments)
    }
  }
}

module.exports = {
  bucketMutations,
  createTypeConfig,
  createArgs
}
