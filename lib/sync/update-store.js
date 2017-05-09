const storageManager = require('brainstem-js').StorageManager.get();
const getStorageManagerListener = require('./storage-manager-listener');

module.exports = (store) => {
  const storageManagerListener = getStorageManagerListener(store);
  for (const collectionName of storageManager.collectionNames()) {
    storageManager.storage(collectionName).on('all', storageManagerListener);
  }
};
