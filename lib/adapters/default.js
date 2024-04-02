import { StorageManager } from 'brainstem-js';

export function fetchCollection(brainstemKey, options) {
  const storageManager = StorageManager.get();
  return storageManager.storage(brainstemKey)
    .fetch({ ...options.fetchOptions, remove: false });
}

export function fetchModel(brainstemKey, modelId, options) {
  const storageManager = StorageManager.get();
  const Model = storageManager.storage(brainstemKey).model;
  return new Model({ id: modelId })
    .fetch({ ...options.fetchOptions, remove: false });
}

export function saveModel(brainstemKey, modelId, attributes, options) {
  const storageManager = StorageManager.get();
  const Model = storageManager.storage(brainstemKey).model;
  return new Model({ id: modelId })
    .save(attributes, options.saveOptions);
}

export function destroyModel(brainstemKey, modelId, options) {
  const storageManager = StorageManager.get();
  const Model = storageManager.storage(brainstemKey).model;
  return new Model({ id: modelId }).destroy(options.deleteOptions);
}

export function validateModel(brainstemKey, attributes, options) {
  const storageManager = StorageManager.get();
  const Model = storageManager.storage(brainstemKey).model;
  return new Model().validate(attributes, options.validateOptions);
}

export function extractIds(collection) {
  return collection.pluck('id');
}

export function extractPayload(collection) {
  return {
    count: collection.getServerCount(),
    currentPage: collection.getPageIndex(),
    results: collection.map((model) => model.attributes),
    totalPages: collection._maxPage(), // eslint-disable-line no-underscore-dangle
  };
}

export function modelToId(model) {
  return model.get('id');
}
