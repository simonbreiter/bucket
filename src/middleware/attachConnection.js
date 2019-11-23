const { connectToDB } = require('../db/db')

async function attachConnection (req, res, next) {
  const { connection, db } = await connectToDB()
  res.locals.connection = connection
  res.locals.db = db
  next()
}

module.exports = {
  attachConnection
}
