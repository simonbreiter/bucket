const request = require('supertest')
const app = require('./server')

test('it should find a specific user', async done => {
  const expected = {
    data: {
      user: {
        name: 'alice'
      }
    }
  }
  const query = `
    query {
      user(id: "a") {
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
  const expected = {
    data: {
      users: [
        {
          id: 'a',
          name: 'alice'
        },
        {
          id: 'b',
          name: 'bob'
        }
      ]
    }
  }
  const query = `
    query {
      users {
        id 
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
