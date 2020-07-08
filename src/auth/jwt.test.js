const { JsonWebTokenError } = require('jsonwebtoken')
const { createJWToken, verifyJWTToken } = require('./jwt')

describe('auth tests', () => {
  test('it should create and verify a JWT token', async () => {
    const token = createJWToken({
      maxAge: 10,
      payload: 'foo'
    })
    const verifiedToken = await verifyJWTToken(token)

    expect(verifiedToken.data).toEqual('foo')
  })

  test('it should throw an error if a token has been tampered', async () => {
    const token = createJWToken({
      maxAge: 10,
      payload: 'foo'
    })

    expect(await verifyJWTToken(token + 'asdf')).toEqual(
      new JsonWebTokenError('invalid signature')
    )
  })
})
