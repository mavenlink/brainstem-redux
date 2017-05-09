const storageManager = require('brainstem-js').StorageManager.get();
const getStorageManagerListener = require('./storage-manager-listener');

module.exports = () => {
  for (const collectionName of storageManager.collectionNames()) {
    storageManager.storage(collectionName).off('all', getStorageManagerListener());
  }
};
