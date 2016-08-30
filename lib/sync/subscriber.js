module.exports = (storageManager, store) => {
  store.subscribe(() => {
    const brainstemTree = store.getState().brainstem;

    for (let brainstemKey in brainstemTree) {
      const models = brainstemTree[brainstemKey];
      const collection = storageManager.storage(brainstemKey);

      for (let modelId in models) {
        const modelAttributes = models[modelId];
        const existingModel = collection.get(modelId);

        if (existingModel) {
          existingModel.set(modelAttributes);
        } else {
          collection.add(modelAttributes);
        }
      }

      const reduxModelIds = Object.keys(models);
      const storageModelIds = collection.pluck('id');
      const removedIds = storageModelIds.filter(id => {
        return reduxModelIds.indexOf(String(id)) == -1
      });

      for (let removedId of removedIds) {
        collection.remove(removedId);
      }
    }
  });
};
