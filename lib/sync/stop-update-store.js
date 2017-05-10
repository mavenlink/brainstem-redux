const getStorageManagerListener = require('./storage-manager-listener');
const storageManagerIterator = require('../helpers').default.storageManagerIterator;

module.exports = () => {
  storageManagerIterator((collection) => {
    collection.off('all', getStorageManagerListener());
  });
};
