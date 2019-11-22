const jwt = require('jsonwebtoken')

function createJWToken ({ maxAge = 3600, sessionData, algorithm = 'HS256' }) {
  return jwt.sign(
    {
      data: sessionData
    },
    process.env.JWT_SECRET,
    {
      expiresIn: maxAge,
      algorithm: algorithm
    }
  )
}

function verifyJWTToken (token) {
  return new Promise((resolve, reject) => {
    jwt.verify(token, process.env.JWT_SECRET, (err, decodedToken) => {
      if (err || !decodedToken) {
        return reject(err)
      } else {
        resolve(decodedToken)
      }
    })
  })
}

module.exports = {
  createJWToken,
  verifyJWTToken
}
