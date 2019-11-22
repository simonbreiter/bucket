const { createJWToken, verifyJWTToken } = require('./jwt')

describe('auth tests', () => {
  test('it should create and verify a JWT token', async () => {
    const token = createJWToken({
      maxAge: 10,
      sessionData: 'foo'
    })
    const verifiedToken = await verifyJWTToken(token)

    expect(verifiedToken.data).toEqual('foo')
  })
})
