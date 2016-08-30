const xhrs = {};

module.exports = {
  fetch(brainstemKey, options = {}) {
    const {
      fetchOptions = {},
      postFetchAction = { type: 'COLLECTION_SYNC' },
      preFetchAction = { type: 'COLLECTION_REQUEST' },
      trackKey,
    } = options;

    if (xhrs[trackKey] && xhrs[trackKey].state() == 'pending') xhrs[trackKey].abort();

    return dispatch => {
      dispatch(preFetchAction);

      const xhr = storageManager.storage(brainstemKey)
        .fetch(Object.assign(fetchOptions, { remove: false }))
        .done(collection => dispatch(postFetchAction(collection.pluck('id'))));

      if (trackKey) xhrs[trackKey] = xhr;

      return xhr;
    };
  },
};
