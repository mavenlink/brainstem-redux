const { StorageManager } = require('brainstem-js');

module.exports = {
  name: 'default',
  connect: (actionName, dispatch, getState) => {
    const storageManager = StorageManager.get();
    const actions = {
      fetchCollection: (brainstemKey, options) => storageManager.storage(brainstemKey)
          .fetch(Object.assign(options.fetchOptions, { remove: false })),
      fetchModel: (brainstemKey, modelId, options) => {
        const Model = storageManager.storage(brainstemKey).model;
        return new Model({ id: modelId })
          .fetch(Object.assign(options.fetchOptions, { remove: false }));
      },
      saveModel: (brainstemKey, modelId, attributes, options) => {
        const Model = storageManager.storage(brainstemKey).model;
        return new Model({ id: modelId })
          .save(attributes, options.saveOptions);
      },
      destroyModel: (brainstemKey, modelId, options) => {
        const Model = storageManager.storage(brainstemKey).model;
        return new Model({ id: modelId }).destroy(options.deleteOptions);
      },
      validateModel: (brainstemKey, attributes, options) => {
        const Model = storageManager.storage(brainstemKey).model;
        return new Model().validate(attributes, options.validateOptions);
      },
    };

    return actions[actionName];
  },
};
