const request = require('supertest')
const app = require('../../server/server')
const { connectToDB } = require('../../db/db')
const { createJWToken } = require('../../auth/jwt')
const { createTypeConfig, createArgs } = require('./mutations')
const { GraphQLString, GraphQLInt } = require('graphql')

test('it should create a type', () => {
  const arr = [
    { name: 'name', value: 'Post' },
    { name: 'id', value: 'int' },
    { name: 'title', value: 'string' },
    { name: 'text', value: 'string' }
  ]

  const expected = {
    name: 'Post',
    fields: {
      name: {
        type: GraphQLString
      },
      id: {
        type: GraphQLString
      },
      title: {
        type: GraphQLString
      },
      text: {
        type: GraphQLString
      }
    }
  }

  expect(createTypeConfig(arr)).toEqual(expected)
})

test('it should create args', () => {
  const arr = [
    { name: 'name', value: 'Post' },
    { name: 'id', value: 'int' },
    { name: 'title', value: 'string' },
    { name: 'text', value: 'string' }
  ]

  const expected = {
    name: {
      type: GraphQLString
    },
    id: {
      type: GraphQLString
    },
    title: {
      type: GraphQLString
    },
    text: {
      type: GraphQLString
    }
  }

  expect(createArgs(arr)).toEqual(expected)
})

test('it should create a bucket', async done => {
  const createQuery = `
    mutation {
      createBucket(
        name: "Post", 
        id: "int", 
        title: "string", 
        text: "string"
        ) {
          name
          id 
          title
          text
      }
    }
  `
  const expected = {
    data: {
      createBucket: {
        name: 'Post',
        id: 'int',
        title: 'string',
        text: 'string'
      }
    }
  }
  await request(app)
    .post('/')
    .set('Content-Type', 'application/graphql')
    .send(createQuery)
    .then(response => {
      expect(response.body).toEqual(expected)
      done()
    })
})
