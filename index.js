const setStorageManager = require('./lib/sync/storage-manager').setStorageManager;

function initialize(inputStorageManager) {
  setStorageManager(inputStorageManager);
  
  return {
    reducer: require('./lib/reducers/index'),
    updateStore: require('./lib/sync/update-store'),
    updateStorageManager: require('./lib/middleware/update-storage-manager'),
    modelActions: require('./lib/actions/model'),
    collectionActions: require('./lib/actions/collection'),
  }
}

module.exports = { initialize };
