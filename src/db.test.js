const { MongoClient, ObjectId } = require('mongodb')

let connection
let db

beforeEach(async () => {
  connection = await MongoClient.connect(
    `mongodb://myuser:example@${process.env.HOST}`,
    {
      authSource: 'admin',
      useNewUrlParser: true
    }
  )
  db = await connection.db('mydb')
})

afterEach(async () => {
  await db.dropDatabase()
  await connection.close()
})

it('should create a collection and one document', async () => {
  let a
  const collection = db.collection('documents')

  collection.insertOne({ a: 1 })
  a = await collection.find({ a: 1 }).toArray()

  expect(a.length).toBe(1)
})

it('should create a collection and some documents', async () => {
  let a, b, c
  const collection = db.collection('documents')

  collection.insertMany([{ a: 1 }, { a: 2 }, { a: 3 }])
  a = await collection.find({ a: 3 }).toArray()
  b = await collection.find({ a: 1 }).toArray()
  c = await collection.find({ a: 4 }).toArray()

  expect(a.length).toBe(1)
  expect(b.length).toBe(1)
  expect(c.length).not.toBe(1)
})

it('should update a document', async () => {
  let a
  const collection = db.collection('documents')
  const id = ObjectId()
  const mock = { _id: id, a: 1 }

  collection.insertOne(mock)
  collection.updateOne(mock, { $set: { b: 1 } })
  a = await collection.findOne({ _id: id })

  expect(a).toEqual({ _id: id, a: 1, b: 1 })
})
