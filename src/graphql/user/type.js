const {
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLInt,
  GraphQLList,
  GraphQLString
} = require('graphql')

const userType = new GraphQLObjectType({
  name: 'User',
  fields: {
    _id: {
      type: GraphQLString
    },
    name: {
      type: GraphQLString
    }
  }
})

module.exports = {
  userType
}
