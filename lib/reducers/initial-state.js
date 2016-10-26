const { StorageManager } = require('brainstem-js');

const brainstemStoreReducer = (brainstemStore, name) =>
  Object.assign({}, brainstemStore, { [name]: {} });

module.exports = () => StorageManager.get().collectionNames().reduce(brainstemStoreReducer, {});
