const {
  MongoClient,
  ObjectId,
  MongoError,
  mongoErrorContextSymbol
} = require('mongodb')

describe('basic db operations', () => {
  let connection, db

  beforeEach(async () => {
    connection = await MongoClient.connect(
      `mongodb://myuser:example@${process.env.MONGODB_HOST}`,
      {
        // authSource: 'admin',
        useUnifiedTopology: true
        // useNewUrlParser: true
      }
    )
    db = await connection.db('db-' + Date.now())
  })

  afterEach(async () => {
    await db.dropDatabase()
    await connection.close()
  })

  test('it should create a collection and find one document', async () => {
    const collection = db.collection('documents')
    const document = {
      _id: 1,
      a: 1
    }

    await collection.insertOne(document)

    expect((await collection.find(document).toArray()).length).toBe(1)
    expect(await collection.findOne(document)).toEqual(document)
  })

  test('it should create a collection and some documents', async () => {
    let a, b, c
    const collection = db.collection('documents')

    const documents = [
      {
        _id: 1,
        a: 1
      },
      {
        _id: 2,
        a: 2
      },
      {
        _id: 3,
        a: 3
      }
    ]

    const expectedDocument = {
      _id: 2,
      a: 2
    }

    await collection.insertMany(documents)

    a = await collection.find({ a: 3 }).toArray()
    b = await collection.find({ a: 1 }).toArray()
    c = await collection.find({ a: 4 }).toArray()

    expect((await collection.find({ a: 3 }).toArray()).length).toBe(1)
    expect((await collection.find({ a: 1 }).toArray()).length).toBe(1)
    expect((await collection.find({ a: 4 }).toArray()).length).not.toBe(1)

    expect(await collection.findOne(expectedDocument)).toEqual(expectedDocument)
  })

  test('it should update a single document', async () => {
    let a
    const collection = db.collection('documents')
    const id = ObjectId()
    const mock = { _id: id, a: 1 }

    await collection.insertOne(mock)
    await collection.updateOne(mock, { $set: { b: 1 } })
    expect(await collection.findOne({ _id: id })).toEqual({
      _id: id,
      a: 1,
      b: 1
    })
  })

  test('it should update many document', async () => {
    let a
    const collection = db.collection('documents')

    const mock = [
      { _id: 1, a: true },
      { _id: 2, a: false },
      { _id: 3, a: false }
    ]
    const mock2 = [
      { _id: 1, a: true },
      { _id: 2, a: true },
      { _id: 3, a: true }
    ]

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
    const collection = db.collection('documents')
    const mock = [
      { _id: ObjectId(), a: true },
      { _id: ObjectId(), a: false },
      { _id: ObjectId(), a: false }
    ]

    await collection.insertMany(mock)
    await collection.deleteMany({ a: false })

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

  test('it should validate documents', async () => {
    await db.createCollection('students', {
      validator: {
        $jsonSchema: {
          bsonType: 'object',
          required: [
            'name',
            'year',
            'major',
            'gpa',
            'address.city',
            'address.street'
          ],
          properties: {
            name: {
              bsonType: 'string',
              description: 'must be a string and is required'
            },
            gender: {
              bsonType: 'string',
              description: 'must be a string and is not required'
            },
            year: {
              bsonType: 'int',
              minimum: 2017,
              maximum: 3017,
              exclusiveMaximum: false,
              description:
                'must be an integer in [ 2017, 3017 ] and is required'
            },
            major: {
              enum: ['Math', 'English', 'Computer Science', 'History', null],
              description: 'can only be one of the enum values and is required'
            },
            gpa: {
              bsonType: ['double'],
              minimum: 0,
              description: 'must be a double and is required'
            },
            'address.city': {
              bsonType: 'string',
              description: 'must be a string and is required'
            },
            'address.street': {
              bsonType: 'string',
              description: 'must be a string and is required'
            }
          }
        }
      }
    })

    const mock = {
      _id: ObjectId(),
      name: 'Muster',
      gender: 'male',
      year: 2019,
      major: 'Math',
      gpa: 1.2,
      address: {
        city: 'Winterthur',
        street: 'Bahnhofstrasse'
      }
    }

    const mock2 = {
      _id: ObjectId(),
      gender: 'male',
      year: 2019,
      major: 'Math',
      gpa: -1,
      address: {
        city: 'Winterthur',
        street: 'Bahnhofstrasse'
      }
    }

    await db.collection('students').insertOne(mock)

    expect(
      await db.collection('students').findOne({
        _id: mock._id
      })
    ).toEqual(mock)

    try {
      await db.collection('students').insertOne(mock2)
    } catch (e) {
      expect({ name: e.name, errmsg: e.errmsg }).toEqual({
        name: 'MongoError',
        errmsg: 'Document failed validation'
      })
    }
  })

  test('it should create multiple collections', async () => {
    await db.createCollection('foo')
    await db.createCollection('bar')
    await db.createCollection('baz')

    const collections = (await db.listCollections().toArray()).map(
      collection => {
        return collection.name
      }
    )
    expect(await collections).toEqual(
      expect.arrayContaining(['bar', 'baz', 'foo'])
    )
  })

  test('it should return number of collections', async () => {
    await db.createCollection('foo')
    await db.createCollection('bar')
    await db.createCollection('baz')

    const arr = await db.listCollections().toArray()

    expect(await arr.length).toEqual(3)
  })
})
