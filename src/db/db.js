require('dotenv').config()

const MongoClient = require('mongodb').MongoClient
const url = `mongodb://myuser:example@${process.env.MONGODB_HOST}`
const { userSchema } = require('./models/User')
const options = {
  useUnifiedTopology: true
}

async function connectToDB () {
  const connection = await MongoClient.connect(url, options)
  const db = connection.db(process.env.ENV === 'dev' ? 'dev' : 'bucket')
  await db.createCollection('User', userSchema)
  return {
    connection: connection,
    db: db
  }
}

module.exports = {
  connectToDB
}
