const {
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLInt,
  GraphQLList,
  GraphQLString
} = require('graphql')
const {
  MongoClient,
  ObjectId,
  MongoError,
  mongoErrorContextSymbol
} = require('mongodb')

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

module.exports = {
  createUserResolver
}
