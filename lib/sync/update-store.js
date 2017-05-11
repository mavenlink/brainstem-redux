import storageManagerCollectionIterator from '../helpers/storage-manager-collection-iterator';
import getStorageManagerListener from './storage-manager-listener';

module.exports = (store) => {
  const storageManagerListener = getStorageManagerListener(store);

  storageManagerCollectionIterator((collection) => {
    collection.on('all', storageManagerListener);
  });
};
