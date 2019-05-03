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

test('it should create a collection and one document', async () => {
  let a
  const collection = db.collection('documents')

  await collection.insertOne({ a: 1 })
  a = await collection.find({ a: 1 }).toArray()

  expect(a.length).toBe(1)
})

test('it should create a collection and some documents', async () => {
  let a, b, c
  const collection = db.collection('documents')

  await collection.insertMany([{ a: 1 }, { a: 2 }, { a: 3 }])
  a = await collection.find({ a: 3 }).toArray()
  b = await collection.find({ a: 1 }).toArray()
  c = await collection.find({ a: 4 }).toArray()

  expect(a.length).toBe(1)
  expect(b.length).toBe(1)
  expect(c.length).not.toBe(1)
})

test('it should update a document', async () => {
  let a
  const collection = db.collection('documents')
  const id = ObjectId()
  const mock = { _id: id, a: 1 }

  await collection.insertOne(mock)
  await collection.updateOne(mock, { $set: { b: 1 } })
  expect(await collection.findOne({ _id: id })).toEqual({ _id: id, a: 1, b: 1 })
})

test('it should update many document', async () => {
  let a
  const collection = db.collection('documents')

  const mock = [{ _id: 1, a: true }, { _id: 2, a: false }, { _id: 3, a: false }]
  const mock2 = [{ _id: 1, a: true }, { _id: 2, a: true }, { _id: 3, a: true }]

  await collection.insertMany(mock)
  await collection.updateMany({ a: false }, { $set: { a: true } })

  expect(await collection.find({}).toArray()).toEqual(mock2)
})

test('it should match an array', async () => {
  const collection = db.collection('documents')
  const mock = [
    { _id: ObjectId(), a: [1, 2] },
    { _id: ObjectId(), a: [2, 3] },
    { _id: ObjectId(), a: [3, 4] }
  ]

  await collection.insertMany(mock)

  expect(
    await collection.findOne({
      a: [1, 2]
    })
  ).toEqual(mock[0])
})

test('it should delete documents', async () => {
  let a
  const collection = db.collection('documents')
  const mock = [
    { _id: ObjectId(), a: true },
    { _id: ObjectId(), a: false },
    { _id: ObjectId(), a: false }
  ]

  await collection.insertMany(mock)
  await collection.deleteMany({ a: false })

  a = await collection
    .find({
      a: true
    })
    .toArray()

  expect(
    await collection
      .find({
        a: true
      })
      .toArray()
  ).toEqual([mock[0]])
})

test('it should limit documents', async () => {
  let a
  const collection = db.collection('documents')
  const mock = [
    { _id: ObjectId(), a: true },
    { _id: ObjectId(), a: false },
    { _id: ObjectId(), a: false }
  ]

  await collection.insertMany(mock)

  a = await collection
    .find({})
    .limit(2)
    .toArray()

  expect(a.length).toEqual(2)
})
