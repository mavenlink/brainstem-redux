const xhrs = {};

module.exports = {
  fetch(brainstemKey, modelId, options = {}) {
    const {
      fetchOptions = {},
      postFetchAction = { type: 'MODEL_SYNC' },
      preFetchAction = { type: 'MODEL_REQUEST' },
      trackKey,
    } = options;

    if (xhrs[trackKey] && xhrs[trackKey].state() == 'pending') xhrs[trackKey].abort();

    return dispatch => {
      dispatch(preFetchAction);

      const xhr = (new storageManager.storage(brainstemKey).model({ id: modelId }))
        .fetch(Object.assign(fetchOptions, { remove: false }))
        .done(model => dispatch(postFetchAction(model.get(id))));

      if (trackKey) xhrs[trackKey] = xhr;

      return xhr;
    };
  },
};
