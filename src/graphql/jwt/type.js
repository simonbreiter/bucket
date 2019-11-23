const { GraphQLObjectType, GraphQLString } = require('graphql')

const jwtType = new GraphQLObjectType({
  name: 'JWT',
  fields: {
    token: {
      type: GraphQLString
    }
  }
})

module.exports = {
  jwtType
}
