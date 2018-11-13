import storageManagerCollectionIterator from '../helpers/storage-manager-collection-iterator';
import getStorageManagerListener from './storage-manager-listener';

export default () => {
  storageManagerCollectionIterator((collection) => {
    collection.off('all', getStorageManagerListener());
  });
};
