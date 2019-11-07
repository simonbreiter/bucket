const request = require('supertest')
const app = require('./server')

const {
  MongoClient,
  ObjectId,
  MongoError,
  mongoErrorContextSymbol
} = require('mongodb')
const { connectToDB } = require('../db/db')

let connection, db

beforeEach(async () => {
  connection = await connectToDB()
  db = await connection.db('dev')
})

afterEach(async () => {
  await db.dropDatabase()
  await connection.close()
})

test('it should create a new user', async done => {
  const expected = {
    data: {
      createUser: {
        name: 'simon'
      }
    }
  }

  const query = `
    mutation {
      createUser(name: "simon") {
        name
      }
    }
  `
  request(app)
    .post('/')
    .set('Content-Type', 'application/graphql')
    .send(query)
    .then(response => {
      expect(response.body).toEqual(expected)
      done()
    })
})

test('it should get a list of every user', async done => {
  const query1 = `
    mutation {
      createUser(name: "alice") {
        name
      }
    }
  `
  const query2 = `
    mutation {
      createUser(name: "bob") {
        name
      }
    }
  `
  const expected = {
    data: {
      users: [
        {
          name: 'alice'
        },
        {
          name: 'bob'
        }
      ]
    }
  }
  const queryUsers = `
    query {
      users {
        name
      }
    }
  `
  await request(app)
    .post('/')
    .set('Content-Type', 'application/graphql')
    .send(query1)

  await request(app)
    .post('/')
    .set('Content-Type', 'application/graphql')
    .send(query2)

  await request(app)
    .get('/')
    .set('Content-Type', 'application/graphql')
    .send(queryUsers)
    .then(response => {
      expect(response.body).toEqual(expected)
      done()
    })
})

// test('it should find a specific user', async done => {
//
//   const createQuery = `
//     mutation {
//       createUser(name: "alice") {
//         name
//       }
//     }
//   `
//   const query = `
//     query {
//       user(_id: "a") {
//         name
//       }
//     }
//   `
//   const expected = {
//     data: {
//       user: {
//         name: 'alice'
//       }
//     }
//   }
//   await request(app)
//     .post('/')
//     .set('Content-Type', 'application/graphql')
//     .send(createQuery)
//
//   await request(app)
//     .post('/')
//     .set('Content-Type', 'application/graphql')
//     .send(query)
//     .then(response => {
//       expect(response.body).toEqual(expected)
//       done()
//     })
// })
