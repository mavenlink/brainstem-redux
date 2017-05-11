import storageManagerCollectionIterator from '../helpers/storage-manager-collection-iterator';
import getStorageManagerListener from './storage-manager-listener';

module.exports = () => {
  storageManagerCollectionIterator((collection) => {
    collection.off('all', getStorageManagerListener());
  });
};
