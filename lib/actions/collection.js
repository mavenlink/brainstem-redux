const defaultAdapter = require('../adapters/default');

const xhrs = {};

module.exports = {
  fetch(brainstemKey, options = {}) {
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

      const xhr = adapter.fetchCollection(brainstemKey, {
        dispatch,
        getState,
        fetchOptions,
      });

      if (postFetchAction) {
        xhr.done(collection =>
          dispatch(postFetchAction(adapter.extractIds(collection)))
        );
      }

      if (trackKey) xhrs[trackKey] = xhr;

      return new Promise((resolve, reject) => xhr
        .done(collection => resolve(adapter.extractPayload(collection, fetchOptions)))
        .fail(reject)
      );
    };
  },
};
