const {
  MongoClient,
  ObjectId,
  MongoError,
  mongoErrorContextSymbol
} = require('mongodb')
const { getCollectionNames } = require('./mongodbTools')

describe('mongodb helper functions', () => {
  let connection, db

  beforeEach(async () => {
    connection = await MongoClient.connect(
      `mongodb://myuser:example@${process.env.MONGODB_HOST}`,
      {
        authSource: 'admin',
        useUnifiedTopology: true,
        useNewUrlParser: true
      }
    )
    db = await connection.db('db-' + Date.now())
  })

  afterEach(async () => {
    await db.dropDatabase()
    await connection.close()
  })

  test('it should get the names of all collections', async () => {
    await db.createCollection('bar')
    await db.createCollection('baz')
    await db.createCollection('foo')

    expect(await getCollectionNames(db)).toEqual(
      expect.arrayContaining(['bar', 'baz', 'foo'])
    )
  })
})
