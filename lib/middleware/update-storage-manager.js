import { StorageManager } from 'brainstem-js';

function syncBrainstem(store) {
  const storageManager = StorageManager.get();
  const brainstemTree = store.getState().brainstem;

  Object.keys(brainstemTree).forEach((brainstemKey) => {
    const models = brainstemTree[brainstemKey];
    const collection = storageManager.storage(brainstemKey);

    Object.keys(models).forEach((modelId) => {
      const modelAttributes = models[modelId];
      const existingModel = collection.get(modelId);

      if (existingModel) {
        existingModel.set(modelAttributes);
      } else {
        collection.add(modelAttributes);
      }
    });

    const reduxModelIds = Object.keys(models);
    const storageModelIds = collection.pluck('id');
    const removedIds = storageModelIds.filter(id => reduxModelIds.indexOf(String(id)) === -1);

    removedIds.forEach(removedId => collection.remove(removedId));
  });
}

export default store => next => (action) => {
  const previousState = store.getState();
  const result = next(action);
  const currentState = store.getState();

  if (action.meta && action.meta.origin === 'storageManager') return result;
  if (previousState.brainstem === currentState.brainstem) return result;

  syncBrainstem(store);
  return result;
};
