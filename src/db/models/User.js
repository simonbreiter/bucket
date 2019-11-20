const userSchema = {
  validator: {
    $jsonSchema: {
      bsonType: 'object',
      required: ['name', 'password'],
      properties: {
        name: {
          bsonType: 'string',
          description: 'must be a string and is required'
        },
        password: {
          bsonType: 'string',
          description: 'must be a string and is required'
        }
      }
    }
  },
  validationLevel: 'strict',
  validationAction: 'error'
}

module.exports = {
  userSchema
}
