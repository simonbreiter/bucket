const request = require('supertest')
const app = require('./server')
const { connectToDB } = require('../db/db')
const { createJWToken } = require('../auth/jwt')

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
    sessionData: 'alice'
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

test('it should verify a token', async done => {
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
    sessionData: 'alice'
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
    .set('Authorization', `bearer ${token}asdf`)
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
