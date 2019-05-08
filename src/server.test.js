const request = require('supertest')
const express = require('express')
const axios = require('axios')
const app = require('./server')

test('server is online', () => {
  request(app)
    .get('/')
    .then(response => {
      expect(response.statusCode).toBe(200)
    })
})

test('hello world from graphql', async done => {
  const expected = { data: { hello: 'Hello world!' } }
  request(app)
    .post('/graphql')
    .send({ query: '{hello}' })
    .then(response => {
      expect(response.body).toEqual(expected)
      done()
    })
})
