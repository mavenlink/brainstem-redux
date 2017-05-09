const storageManager = require('brainstem-js').StorageManager.get();

const storageManagerIterator = (callback) => {
  for (const collectionName of storageManager.collectionNames()) {
    callback(storageManager.storage(collectionName));
  }
};

export default {
  storageManagerIterator,
};
