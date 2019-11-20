const { getCollectionNames } = require('./mongodbTools')
const { connectToDB } = require('../db')

describe('mongodb helper functions', () => {
  let connection, db

  beforeEach(async () => {
    ;({ connection, db } = await connectToDB())
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
