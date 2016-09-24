module.exports = {
  reducer: require('lib/reducers/index'),
  updateStore: require('lib/sync/event-handler'),
  updateStorageManager: require('lib/middleware/sync-brainstem'),
  modelActions: require('lib/actions/model'),
  collectionActions: require('lib/actions/collection'),
}
