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

test('it should create a new user', async done => {
  const expected = {
    data: {
      createUser: {
        name: 'simon',
        password: 'foo'
      }
    }
  }

  const query = `
    mutation {
      createUser(name: "simon", password: "foo") {
        name
        password
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

test('it should create a token', async done => {
  const createQuery = `
    mutation {
      createUser(name: "alice", password: "foo") {
        name
      }
    }
  `
  const loginQuery = `
    mutation {
      loginUser(name: "alice", password: "foo") {
        token
      }
    }
  `
  const token = createJWToken({
    maxAge: 10,
    payload: 'alice'
  })
  const expected = {
    data: {
      loginUser: {
        token: token
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
    .send(loginQuery)
    .then(response => {
      expect(response.body).toEqual(expected)
      done()
    })
})

test('it should not allow duplicate user names', async done => {
  const createQuery = `
    mutation {
      createUser(name: "alice", password: "foo") {
        name
      }
    }
  `
  const expected = {
    data: {
      createUser: {
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
    .send(createQuery)
    .then(response => {
      expect(response.body.errors[0].message).toEqual('User already exists')
      done()
    })
})
