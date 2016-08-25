module.exports = (storageManager) => {
  const brainstemStoreReducer = (brainstemStore, name) => {
    brainstemStore[name] = {};
    return brainstemStore;
  };

  return {
    brainstem: storageManager.collectionNames().reduce(brainstemStoreReducer, {})
  };
};
