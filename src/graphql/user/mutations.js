const { GraphQLString } = require('graphql')
const { userType } = require('./type')

const createUserResolver = async (obj, { name, password }, context) => {
  const user = {
    name: name,
    password: password
  }
  const users = context.db.collection('User')
  await users.insertOne(user)
  return user
}

const mutations = {
  createUser: {
    type: userType,
    args: {
      name: {
        type: GraphQLString
      },
      password: {
        type: GraphQLString
      }
    },
    resolve: createUserResolver
  }
}

module.exports = {
  mutations
}
