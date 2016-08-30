const xhrs = {};

module.exports = {
  fetch(options) {
    const {
      brainstemKey,
      fetchOptions,
      postFetchAction,
      preFetchAction,
      trackKey,
    } = options;

    if (xhrs[trackKey] && xhrs[trackKey].state() == 'pending') xhrs[trackKey].abort();

    return dispatch => {
      dispatch(preFetchAction);

      const options = Object.assign(fetchOptions, { remove: false });
      const doneCallback = collection => dispatch(postFetchAction(collection.pluck('id')))

      const xhr = storageManager.storage(brainstemKey)
        .fetch(options)
        .done(doneCallback);

      if (trackKey) xhrs[trackKey] = xhr;

      return xhr;
    };
  },
};
