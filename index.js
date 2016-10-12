module.exports = {
  reducer: require('./lib/reducers/index'),
  updateStore: require('./lib/sync/update-store'),
  updateStorageManager: require('./lib/middleware/update-storage-manager'),
  modelActions: require('./lib/actions/model'),
  collectionActions: require('./lib/actions/collection'),
};
