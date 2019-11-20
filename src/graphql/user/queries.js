const { GraphQLList, GraphQLString } = require('graphql')
const { userType } = require('./type')

const userResolver = (obj, { _id, name }, context) => {
  const users = context.db.collection('User')
  return users.findOne({
    $or: [{ _id }, { name }]
  })
}

const usersResolver = (obj, args, context) => {
  const users = context.db.collection('User')
  return users.find({}).toArray()
}

const queries = {
  user: {
    type: userType,
    args: {
      _id: {
        type: GraphQLString
      },
      name: {
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

module.exports = {
  queries
}
