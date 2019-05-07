/**
 * Get all collection names from a db
 * @param {Object} db The target db
 * @returns {String[]} Array of names
 */
async function getCollectionNames (db) {
  return (await db.collections()).map(collection => collection.s.name)
}

module.exports = {
  getCollectionNames: getCollectionNames
}
