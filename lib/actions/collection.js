const xhrs = {};

module.exports = (storageManager) => ({
  fetch(brainstemKey, options = {}) {
    const {
      fetchOptions = {},
      postFetchAction,
      preFetchAction,
      trackKey,
    } = options;

    if (xhrs[trackKey] && xhrs[trackKey].state() == 'pending') xhrs[trackKey].abort();

    return dispatch => {
      if (preFetchAction) dispatch(preFetchAction);

      const xhr = storageManager.storage(brainstemKey)
        .fetch(Object.assign(fetchOptions, { remove: false }))

      if (postFetchAction) xhr.done(collection => dispatch(postFetchAction(collection.pluck('id'))));

      if (trackKey) xhrs[trackKey] = xhr;

      return xhr;
    };
  },
});
