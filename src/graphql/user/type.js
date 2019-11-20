const { GraphQLObjectType, GraphQLString } = require('graphql')

const userType = new GraphQLObjectType({
  name: 'User',
  fields: {
    _id: {
      type: GraphQLString
    },
    name: {
      type: GraphQLString
    },
    password: {
      type: GraphQLString
    }
  }
})

module.exports = {
  userType
}
