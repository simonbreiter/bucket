const MongoClient = require('mongodb').MongoClient
const url = `mongodb://myuser:example@${process.env.MONGODB_HOST}`
const options = {
  useUnifiedTopology: true
}

async function connectToDB () {
  return MongoClient.connect(url, options)
}

module.exports = {
  connectToDB
}
