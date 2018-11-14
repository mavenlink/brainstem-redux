import $ from 'jquery';
import defaultAdapter from '../adapters/default';

const xhrs = {};

export default {
  fetch(brainstemKey, modelId, options = {}) {
    const {
      fetchOptions = {},
      postFetchAction,
      preFetchAction,
      trackKey,
      adapter = defaultAdapter,
    } = options;

    if (xhrs[trackKey] && xhrs[trackKey].state() === 'pending') xhrs[trackKey].abort();

    return (dispatch, getState) => {
      if (preFetchAction) dispatch(preFetchAction);

      const xhr = adapter.fetchModel(brainstemKey, modelId, {
        dispatch,
        getState,
        fetchOptions,
      });

      if (postFetchAction) xhr.done(model => dispatch(postFetchAction(adapter.modelToId(model))));

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
      adapter = defaultAdapter,
    } = options;

    if (xhrs[trackKey] && xhrs[trackKey].state() === 'pending') xhrs[trackKey].abort();

    return (dispatch, getState) => {
      if (preSaveAction) dispatch(preSaveAction);

      let xhr = adapter.saveModel(brainstemKey, modelId, attributes, {
        dispatch,
        getState,
        saveOptions,
      });

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
    const {
      deleteOptions = {},
      postDestroyAction,
      trackKey,
      adapter = defaultAdapter,
    } = options;

    if (xhrs[trackKey] && xhrs[trackKey].state() === 'pending') xhrs[trackKey].abort();

    return (dispatch, getState) => {
      const xhr = adapter.destroyModel(brainstemKey, modelId, {
        dispatch,
        getState,
        deleteOptions,
      });

      if (postDestroyAction) {
        xhr.done(model => dispatch(postDestroyAction(adapter.modelToId(model))));
      }

      if (trackKey) xhrs[trackKey] = xhr;

      return xhr;
    };
  },

  validate(brainstemKey, attributes, options = {}) {
    const {
      validateOptions = {},
      preValidateAction,
      postValidateAction,
      adapter = defaultAdapter,
    } = options;

    return (dispatch, getState) => {
      if (preValidateAction) dispatch(preValidateAction);

      const validationErrors = adapter.validateModel(brainstemKey, attributes, {
        dispatch,
        getState,
        validateOptions,
      });

      if (postValidateAction) { dispatch(postValidateAction(validationErrors)); }

      return validationErrors;
    };
  },
};
