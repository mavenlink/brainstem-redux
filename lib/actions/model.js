const { StorageManager } = require('brainstem-js');
const $ = require('jquery');

const xhrs = {};

const storageManagerAdapter = {
  fetchModel: (brainstemKey, modelId, options) => {
    const storageManager = StorageManager.get();
    const Model = storageManager.storage(brainstemKey).model;
    return new Model({ id: modelId })
      .fetch(Object.assign(options.fetchOptions, { remove: false }));
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
  }
}

module.exports = {
  fetch(brainstemKey, modelId, options = {}) {
    const {
      fetchOptions = {},
      postFetchAction,
      preFetchAction,
      trackKey,
      adapter = storageManagerAdapter,
    } = options;

    if (xhrs[trackKey] && xhrs[trackKey].state() === 'pending') xhrs[trackKey].abort();

    return (dispatch) => {
      if (preFetchAction) dispatch(preFetchAction);

      const xhr = adapter.fetchModel(brainstemKey, modelId, { fetchOptions });

      if (postFetchAction) xhr.done(model => dispatch(postFetchAction(model.get('id'))));

      if (trackKey) xhrs[trackKey] = xhr;

      return xhr;
    };
  },

  save(brainstemKey, modelId, attributes, options = {}) {
    const {
      saveOptions = {},
      preSaveAction,
      postSaveAction,
      trackKey,
      adapter = storageManagerAdapter,
    } = options;

    const storageManager = StorageManager.get();

    if (xhrs[trackKey] && xhrs[trackKey].state() === 'pending') xhrs[trackKey].abort();

    return (dispatch) => {
      if (preSaveAction) dispatch(preSaveAction);

      let xhr = adapter.saveModel(brainstemKey, modelId, attributes, { saveOptions });

      // backbone returns false when the model is invalid
      if (!xhr.then) {
        xhr = $.Deferred() // eslint-disable-line new-cap
          .reject()
          .promise();
      }

      if (postSaveAction) {
        xhr.done((response) => {
          const newModelId = response.results[0].id;
          dispatch(postSaveAction(newModelId));
        });
      }

      if (trackKey) xhrs[trackKey] = xhr;

      return xhr;
    };
  },

  destroy(brainstemKey, modelId, options = {}) {
    const storageManager = StorageManager.get();
    const {
      deleteOptions = {},
      trackKey,
      adapter = storageManagerAdapter,
    } = options;

    if (xhrs[trackKey] && xhrs[trackKey].state() === 'pending') xhrs[trackKey].abort();

    return () => {
      const xhr = adapter.destroyModel(brainstemKey, modelId, { deleteOptions });

      if (trackKey) xhrs[trackKey] = xhr;

      return xhr;
    };
  },

  validate(brainstemKey, attributes, options = {}) {
    const {
      validateOptions = {},
      preValidateAction,
      postValidateAction,
      adapter = storageManagerAdapter,
    } = options;

    return (dispatch) => {
      if (preValidateAction) dispatch(preValidateAction);

      const validationErrors = adapter.validateModel(brainstemKey, attributes, { validateOptions })

      if (postValidateAction) { dispatch(postValidateAction(validationErrors)); }

      return validationErrors;
    };
  },
};
