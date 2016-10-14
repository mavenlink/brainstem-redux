const defaultStorageManager = require('brainstem-js').StorageManager.get();

let storageManager;

const setStorageManager = function(inputStorageManager) {
  storageManager = inputStorageManager;
};

const retrieveStorageManager = function() {
  return storageManager || defaultStorageManager;
};

module.exports = { setStorageManager, retrieveStorageManager };
