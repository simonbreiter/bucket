const { GraphQLString } = require('graphql')
const { MongoClient } = require('mongodb')
const { userType } = require('./type')

const createUserResolver = async (_, { name }) => {
  const user = {
    name: name
  }
  const connection = await MongoClient.connect(
    `mongodb://myuser:example@${process.env.MONGODB_HOST}`,
    {
      useUnifiedTopology: true
    }
  )
  const db = await connection.db('mydb')
  const users = db.collection('Users')

  await users.insertOne(user)
  // await connection.close()

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
