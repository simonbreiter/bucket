const {
  MongoClient,
  ObjectId,
  MongoError,
  mongoErrorContextSymbol
} = require('mongodb')
const { getCollectionNames } = require('./mongodbTools')

let connection
let db

beforeEach(async () => {
  connection = await MongoClient.connect(
    `mongodb://myuser:example@${process.env.HOST}`,
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

test('it should create a collection', async () => {
  await db.createCollection('foo')
  await db.createCollection('bar')
  await db.createCollection('baz')
  const collections = (await db.listCollections().toArray()).map(collection => {
    return collection.name
  })
  expect(await collections).toEqual(
    expect.arrayContaining(['bar', 'baz', 'foo'])
  )
})
