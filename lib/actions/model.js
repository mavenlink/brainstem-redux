const xhrs = {};

module.exports = {
  fetch(brainstemKey, modelId, options = {}) {
    const {
      fetchOptions = {},
      postFetchAction,
      preFetchAction,
      trackKey,
    } = options;

    if (xhrs[trackKey] && xhrs[trackKey].state() == 'pending') xhrs[trackKey].abort();

    return dispatch => {
      if (preFetchAction) dispatch(preFetchAction);

      const xhr = (new storageManager.storage(brainstemKey).model({ id: modelId }))
        .fetch(Object.assign(fetchOptions, { remove: false }))

      if (postFetchAction) xhr.done(model => dispatch(postFetchAction(model.get(id))));

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

    if (xhrs[trackKey] && xhrs[trackKey].state() == 'pending') xhrs[trackKey].abort();

    return dispatch => {
      if (preSaveAction) dispatch(preSaveAction);

      const xhr = (new storageManager.storage(brainstemKey).model({ id: modelId }))
        .save(attributes, saveOptions)

      if (postSaveAction) xhr.done(model => dispatch(postSaveAction(model.get(id))));

      if (trackKey) xhrs[trackKey] = xhr;

      return xhr;
    };
  },

  validate(brainstemKey, modelId, attributes, options) {
    /* should be extremely similar to fetch and save */
  },
};