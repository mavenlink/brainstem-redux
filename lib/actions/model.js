const { StorageManager } = require('brainstem-js');
const $ = require('jquery');

const xhrs = {};

module.exports = {
  fetch(brainstemKey, modelId, options = {}) {
    const {
      fetchOptions = {},
      postFetchAction,
      preFetchAction,
      trackKey,
    } = options;

    const storageManager = StorageManager.get();

    if (xhrs[trackKey] && xhrs[trackKey].state() === 'pending') xhrs[trackKey].abort();

    return (dispatch) => {
      if (preFetchAction) dispatch(preFetchAction);

      const Model = storageManager.storage(brainstemKey).model;
      const xhr = new Model({ id: modelId })
        .fetch(Object.assign(fetchOptions, { remove: false }));

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
    } = options;

    const storageManager = StorageManager.get();

    if (xhrs[trackKey] && xhrs[trackKey].state() === 'pending') xhrs[trackKey].abort();

    return (dispatch) => {
      if (preSaveAction) dispatch(preSaveAction);

      const Model = storageManager.storage(brainstemKey).model;
      let xhr = new Model({ id: modelId })
        .save(attributes, saveOptions);

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
    } = options;

    if (xhrs[trackKey] && xhrs[trackKey].state() === 'pending') xhrs[trackKey].abort();

    return () => {
      const Model = storageManager.storage(brainstemKey).model;
      const xhr = new Model({ id: modelId }).destroy(deleteOptions);
      if (trackKey) xhrs[trackKey] = xhr;

      return xhr;
    };
  },

  validate(brainstemKey, attributes, options = {}) {
    const {
      validateOptions = {},
      preValidateAction,
      postValidateAction,
    } = options;

    const storageManager = StorageManager.get();

    return (dispatch) => {
      if (preValidateAction) dispatch(preValidateAction);

      const Model = storageManager.storage(brainstemKey).model;
      const validationErrors = new Model().validate(attributes, validateOptions);

      if (postValidateAction) { dispatch(postValidateAction(validationErrors)); }

      return validationErrors;
    };
  },
};
