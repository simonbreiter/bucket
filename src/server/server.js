require('dotenv').config()

const express = require('express')
const graphqlHTTP = require('express-graphql')
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

const port = process.env.API_PORT
const app = express()

// Types
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

// Resolver
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

  await connection.close()

  return result
}

// Queries
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
    resolve: async () => {
      const connection = await MongoClient.connect(
        `mongodb://myuser:example@${process.env.MONGODB_HOST}`,
        {
          useUnifiedTopology: true
        }
      )
      const db = await connection.db('mydb')
      const users = db.collection('Users')
      const result = await users.find({}).toArray()
      // console.log(result)

      await connection.close()

      return result
    }
  }
}

// mutations
const mutations = {
  createUser: {
    type: userType,
    args: {
      name: {
        type: GraphQLString
      }
    },
    resolve: async (_, { name }) => {
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
      await connection.close()

      return user
    }
  }
}

/**
 * Builds and returns new schema
 */
const buildSchema = () =>
  new GraphQLSchema({
    query: new GraphQLObjectType({
      name: 'Query',
      description: 'Possible queries',
      fields: queries
    }),
    mutation: new GraphQLObjectType({
      name: 'Mutation',
      description: 'Possible mutations',
      fields: mutations
    })
  })

app.use(
  '/',
  graphqlHTTP(async (req, res) => ({
    // build schema on every request, so we can modify schema at runtime
    schema: buildSchema(),
    graphiql: true
  }))
)

if (process.env.ENV !== 'dev') {
  app.listen(port, () => console.log(`Server runs on port ${port}!`))
}

module.exports = app
