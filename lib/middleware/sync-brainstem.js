const { StorageManager } = require('brainstem-js')
const storageManager = StorageManager.get()

function syncBrainstem(store) {
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
}

module.exports = store => next => action => {
  const result = next(action);

  if (action.meta && action.meta.origin === 'storageManager') return action;

  syncBrainstem(store);
  return action;
};
