const { StorageManager } = require('brainstem-js');

module.exports = {
  fetchCollection: (brainstemKey, options) => {
    const storageManager = StorageManager.get();
    return storageManager.storage(brainstemKey)
      .fetch(Object.assign({}, options.fetchOptions, { remove: false }));
  },
  fetchModel: (brainstemKey, modelId, options) => {
    const storageManager = StorageManager.get();
    const Model = storageManager.storage(brainstemKey).model;
    return new Model({ id: modelId })
      .fetch(Object.assign({}, options.fetchOptions, { remove: false }));
  },
  saveModel: (brainstemKey, modelId, attributes, options) => {
    const storageManager = StorageManager.get();
    const Model = storageManager.storage(brainstemKey).model;
    return new Model({ id: modelId })
      .save(attributes, options.saveOptions);
  },
  destroyModel: (brainstemKey, modelId, options) => {
    const storageManager = StorageManager.get();
    const Model = storageManager.storage(brainstemKey).model;
    return new Model({ id: modelId }).destroy(options.deleteOptions);
  },
  validateModel: (brainstemKey, attributes, options) => {
    const storageManager = StorageManager.get();
    const Model = storageManager.storage(brainstemKey).model;
    return new Model().validate(attributes, options.validateOptions);
  },
  collectionToIds: collection => collection.pluck('id'),
  collectionToArray(collection) {
    return {
      count: collection.getServerCount(),
      currentPage: collection.getPageIndex(),
      results: collection.map(model => model.attributes),
      totalPages: collection._maxPage(), // eslint-disable-line no-underscore-dangle
    };
  },
  modelToId: model => model.get('id'),
};
