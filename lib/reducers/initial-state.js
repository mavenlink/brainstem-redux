const storageManager = require('../sync/storage-manager').retrieveStorageManager();
const brainstemStoreReducer = (brainstemStore, name) => {
  brainstemStore[name] = {};
  return brainstemStore;
};

module.exports = storageManager.collectionNames().reduce(brainstemStoreReducer, {});
