import storageManagerCollectionIterator from '../helpers/storage-manager-collection-iterator';
import getStorageManagerListener from './storage-manager-listener';

export default (store) => {
  const storageManagerListener = getStorageManagerListener(store);

  storageManagerCollectionIterator((collection) => {
    collection.on('all', storageManagerListener);
  });
};
