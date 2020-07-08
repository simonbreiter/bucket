const { GraphQLString } = require('graphql')
const { userType } = require('./type')
const { jwtType } = require('../jwt/type')
const { createJWToken } = require('../../auth/jwt')

const createUserResolver = async (obj, { name, password }, context) => {
  const user = {
    name: name,
    password: password
  }
  const users = context.db.collection('User')

  if ((await users.find({ name: name }).toArray()).length !== 0) {
    throw new Error('User already exists')
  } else {
    await users.insertOne(user)
    return user
  }
}

const loginUserResolver = (obj, { name, password }, context) => {
  const users = context.db.collection('User')
  return users.findOne({ name: name, password: password }).then(() => {
    return {
      token: createJWToken({
        maxAge: 10,
        payload: name
      })
    }
  })
}

const userMutations = {
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
  },
  loginUser: {
    type: jwtType,
    args: {
      name: {
        type: GraphQLString
      },
      password: {
        type: GraphQLString
      }
    },
    resolve: loginUserResolver
  }
}

module.exports = {
  userMutations
}
