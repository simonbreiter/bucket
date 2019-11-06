const { GraphQLList, GraphQLString } = require('graphql')
const { MongoClient, ObjectId } = require('mongodb')
const { userType } = require('./type')

const userResolver = async (_, { _id }) => {
  const connection = await MongoClient.connect(
    `mongodb://myuser:example@${process.env.MONGODB_HOST}`,
    {
      useUnifiedTopology: true
    }
  )
  const db = await connection.db('mydb')
  const users = db.collection('Users')
  const result = await users.findOne({
    _id: ObjectId(_id)
  })

  // await connection.close()

  return result
}

const usersResolver = async () => {
  const connection = await MongoClient.connect(
    `mongodb://myuser:example@${process.env.MONGODB_HOST}`,
    {
      useUnifiedTopology: true
    }
  )
  const db = await connection.db('mydb')
  const users = db.collection('Users')
  const result = await users.find({}).toArray()

  // await connection.close()

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
