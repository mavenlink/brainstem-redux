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
};
