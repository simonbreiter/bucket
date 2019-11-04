/**
 * Get all collection names from a db
 * @param {Object} db The target db
 * @returns {String[]} Array of names
 */
async function getCollectionNames (db) {
  return (await db.listCollections().toArray()).map(
    collection => collection.name
  )
}

// const collections = (await db.listCollections().toArray()).map(collection => {
//   return collection.name
// })

module.exports = {
  getCollectionNames: getCollectionNames
}
