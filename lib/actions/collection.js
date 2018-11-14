import defaultAdapter from '../adapters/default';

const xhrs = {};

export default {
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
        xhr.done(response =>
          dispatch(postFetchAction(adapter.extractIds(response)))
        );
      }

      if (trackKey) xhrs[trackKey] = xhr;

      return new Promise((resolve, reject) => xhr
        .done(response => resolve(adapter.extractPayload(response)))
        .fail(reject)
      );
    };
  },
};
