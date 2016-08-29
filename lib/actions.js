const xhrs = {};

module.exports = function fetchCollection(options) {
  const {
    brainstemKey,
    fetchOptions,
    postFetchAction,
    preFetchAction,
    trackKey,
  } = options;

  if (xhrs[trackKey] && xhrs[trackKey].state() == 'pending') xhrs[trackKey].abort();

  return function (dispatch) {
    dispatch(preFetchAction);

    const xhr = storageManager.storage(brainstemKey).fetch(Object.assign(fetchOptions, {
      remove: false
    })).done(collection => {
      dispatch(postFetchAction(collection.pluck('id')))
    });

    if (trackKey) xhrs[trackKey] = xhr;

    return xhr;
  }
};
