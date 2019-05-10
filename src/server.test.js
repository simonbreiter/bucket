const request = require('supertest')
const express = require('express')
const app = require('./server')

test('it should allow basic queries', async done => {
  const expected = { data: { hello: 'Hello world!' } }
  request(app)
    .post('/')
    .set('Content-Type', 'application/graphql')
    .send('query { hello }')
    .then(response => {
      expect(response.body).toEqual(expected)
      done()
    })
})

test('it should build schema on each api request', async done => {
  const expected = { data: { hello2: 'Hello world!2' } }
  request(app)
    .post('/')
    .set('Content-Type', 'application/graphql')
    .send('query { hello2 }')
    .then(response => {
      expect(response.body).toEqual(expected)
      done()
    })
})

test('it should allow basic mutations', async done => {
  const expected = { data: { createFoo: 'baz' } }
  request(app)
    .post('/')
    .set('Content-Type', 'application/graphql')
    .send('mutation { createFoo(bar: "baz") }')
    .then(response => {
      expect(response.body).toEqual(expected)
      done()
    })
})
