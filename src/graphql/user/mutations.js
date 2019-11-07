const { GraphQLString } = require('graphql')
const { userType } = require('./type')

const createUserResolver = async (obj, { name }, context) => {
  const user = {
    name: name
  }
  const users = context.db.collection('Users')
  await users.insertOne(user)
  return user
}

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

module.exports = {
  mutations
}
