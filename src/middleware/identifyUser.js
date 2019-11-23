const { verifyJWTToken } = require('../auth/jwt')

async function identifyUser (req, res, next) {
  let token = req.headers.authorization

  if (token) {
    token = token.slice(7, token.length)
    try {
      res.locals.token = await verifyJWTToken(token)
    } catch (err) {
      console.error(err)
    }
    next()
  } else {
    next()
  }
}

module.exports = {
  identifyUser
}
