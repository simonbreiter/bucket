const { GraphQLList, GraphQLString } = require('graphql')
const { userType } = require('./type')

const userResolver = async (obj, { _id }, context) => {
  const users = context.db.collection('Users')
  const result = await users.findOne({
    _id: _id
  })
  return result
}

const usersResolver = async (obj, args, context) => {
  const users = context.db.collection('Users')
  const result = await users.find({}).toArray()
  return result
}

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

module.exports = {
  queries
}
