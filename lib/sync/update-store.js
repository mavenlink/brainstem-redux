const getStorageManagerListener = require('./storage-manager-listener');
const storageManagerIterator = require('../helpers').default.storageManagerIterator;

module.exports = (store) => {
  const storageManagerListener = getStorageManagerListener(store);

  storageManagerIterator((collection) => {
    collection.on('all', storageManagerListener);
  });
};
