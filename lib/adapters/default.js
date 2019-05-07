import { StorageManager } from 'brainstem-js';

export const fetchCollection = (brainstemKey, options) => {
  const storageManager = StorageManager.get();
  return storageManager.storage(brainstemKey)
    .fetch(Object.assign({}, options.fetchOptions, { remove: false }));
};

export const fetchModel = (brainstemKey, modelId, options) => {
  const storageManager = StorageManager.get();
  const Model = storageManager.storage(brainstemKey).model;
  return new Model({ id: modelId })
    .fetch(Object.assign({}, options.fetchOptions, { remove: false }));
};

export const saveModel = (brainstemKey, modelId, attributes, options) => {
  const storageManager = StorageManager.get();
  const Model = storageManager.storage(brainstemKey).model;
  return new Model({ id: modelId })
    .save(attributes, options.saveOptions);
};

export const destroyModel = (brainstemKey, modelId, options) => {
  const storageManager = StorageManager.get();
  const Model = storageManager.storage(brainstemKey).model;
  return new Model({ id: modelId }).destroy(options.deleteOptions);
};

export const validateModel = (brainstemKey, attributes, options) => {
  const storageManager = StorageManager.get();
  const Model = storageManager.storage(brainstemKey).model;
  return new Model().validate(attributes, options.validateOptions);
};

export const extractIds = collection => collection.pluck('id');

export const extractPayload = collection => (
  {
    count: collection.getServerCount(),
    currentPage: collection.getPageIndex(),
    results: collection.map(model => model.attributes),
    totalPages: collection._maxPage(), // eslint-disable-line no-underscore-dangle
  }
);

export const modelToId = model => model.get('id');
