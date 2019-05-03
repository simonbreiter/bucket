const request = require('supertest')
const express = require('express')
const app = require('./server')

test('server is online', () => {
  return request(app)
    .get('/')
    .then(response => {
      expect(response.statusCode).toBe(200)
    })
})
