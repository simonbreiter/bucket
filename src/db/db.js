const {
  MongoClient,
  ObjectId,
  MongoError,
  mongoErrorContextSymbol
} = require('mongodb')

const dbFactory = async () => {
  const connection = await MongoClient.connect(
    `mongodb://myuser:example@${process.env.MONGODB_HOST}`,
    {
      // authSource: 'admin',
      useUnifiedTopology: true
      // useNewUrlParser: true
    }
  )
  const db = await connection.db('db-' + Date.now())
  return {
    connection: connection,
    db: db
  }
}

module.exports.dbFactory = dbFactory
