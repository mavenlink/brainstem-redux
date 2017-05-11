const storageManager = require('brainstem-js').StorageManager.get();

export default function storageManagerCollectionIterator(callback) {
  for (const collectionName of storageManager.collectionNames()) {
    callback(storageManager.storage(collectionName));
  }
}

