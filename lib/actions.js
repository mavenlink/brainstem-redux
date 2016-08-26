module.exports = function fetchCollection(options) {
  const {
    brainstemKey,
    fetchOptions,
    postFetchAction,
    preFetchAction,
  } = options;

  return function (dispatch) {
    dispatch(preFetchAction);

    return storageManager.storage(brainstemKey).fetch(Object.assign(fetchOptions, {
      remove: false
    })).done(collection => {
      dispatch(postFetchAction(collection.pluck('id')))
    });
  }
};
