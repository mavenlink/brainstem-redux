const storageManager = require('brainstem-js').StorageManager.get()
const brainstemStoreReducer = (brainstemStore, name) => {
  brainstemStore[name] = {};
  return brainstemStore;
};

module.exports = storageManager.collectionNames().reduce(brainstemStoreReducer, {});
