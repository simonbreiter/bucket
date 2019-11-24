const bodyParser = require('body-parser')
const { parse } = require('graphql')

async function parseGraphQL (req, res, next) {
  if (req.is('application/graphql')) {
    bodyParser.text({ type: 'application/graphql' })(req, res, () => {
      const gql = parse(req.body)
      req.graphql = {
        graphql: {
          operation: gql.definitions[0].operation,
          function: gql.definitions[0].selectionSet.selections[0].name.value,
          arguments: gql.definitions[0].selectionSet.selections[0].arguments.map(
            el => ({
              name: el.name.value,
              value: el.value.value
            })
          )
        }
      }
      next()
    })
  } else {
    next()
  }
}

module.exports = {
  parseGraphQL
}
