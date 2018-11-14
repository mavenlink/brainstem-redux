import brainstemJs from 'brainstem-js';

const storageManager = brainstemJs.StorageManager.get();

export default function storageManagerCollectionIterator(callback) {
  for (const collectionName of storageManager.collectionNames()) {
    callback(storageManager.storage(collectionName));
  }
}
