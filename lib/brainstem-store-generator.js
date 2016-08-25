module.exports = (storageManager) => {
  const brainstemStoreReducer = (brainstemStore, name) => {
    brainstemStore[name] = {};
    return brainstemStore;
  };

  return storageManager.collectionNames().reduce(brainstemStoreReducer, {});
};
