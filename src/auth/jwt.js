const jwt = require('jsonwebtoken')

/**
 *  Create a JWT token.
 * @param maxAge
 * @param payload
 * @param algorithm
 * @returns {undefined|*}
 */
function createJWToken ({ maxAge = 3600, payload, algorithm = 'HS256' }) {
  return jwt.sign(
    {
      data: payload
    },
    process.env.JWT_SECRET,
    {
      expiresIn: maxAge,
      algorithm: algorithm
    }
  )
}

/**
 * Verify a JWT token.
 * @param token
 * @returns {Promise<unknown>}
 */
function verifyJWTToken (token) {
  return new Promise((resolve, reject) => {
    jwt.verify(token, process.env.JWT_SECRET, (err, decodedToken) => {
      if (err || !decodedToken) {
        return reject(err)
      } else {
        resolve(decodedToken)
      }
    })
  }).catch(err => err)
}

module.exports = {
  createJWToken,
  verifyJWTToken
}
