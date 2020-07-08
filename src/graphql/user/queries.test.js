const request = require('supertest')
const app = require('../../server/server')
const { connectToDB } = require('../../db/db')
const { createJWToken } = require('../../auth/jwt')

let connection, db

beforeEach(async () => {
  ;({ connection, db } = await connectToDB())
})

afterEach(async () => {
  await db.dropDatabase()
  await connection.close()
})

test('it should get a list of every user', async done => {
  const query1 = `
    mutation {
      createUser(name: "alice", password: "foo") {
        name,
        password
      }
    }
  `
  const query2 = `
    mutation {
      createUser(name: "bob", password: "bar") {
        name,
        password
      }
    }
  `
  const queryUsers = `
    query {
      users {
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

test('it should find a specific user', async done => {
  const createQuery = `
    mutation {
      createUser(name: "alice", password: "foo") {
        name
      }
    }
  `
  const query = `
    query {
      user(name: "alice") {
        name
      }
    }
  `
  const expected = {
    data: {
      user: {
        name: 'alice'
      }
    }
  }
  await request(app)
    .post('/')
    .set('Content-Type', 'application/graphql')
    .send(createQuery)

  await request(app)
    .post('/')
    .set('Content-Type', 'application/graphql')
    .send(query)
    .then(response => {
      expect(response.body).toEqual(expected)
      done()
    })
})
