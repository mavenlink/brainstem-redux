const { StorageManager } = require('brainstem-js');

const xhrs = {};

module.exports = {
  fetch(brainstemKey, options = {}) {
    const {
      fetchOptions = {},
      postFetchAction,
      preFetchAction,
      trackKey,
    } = options;

    const storageManager = StorageManager.get();

    if (xhrs[trackKey] && xhrs[trackKey].state() === 'pending') xhrs[trackKey].abort();

    return (dispatch) => {
      if (preFetchAction) dispatch(preFetchAction);

      const xhr = storageManager.storage(brainstemKey)
        .fetch(Object.assign(fetchOptions, { remove: false }));

      if (postFetchAction) xhr.done(collection => dispatch(postFetchAction(collection.pluck('id'))));

      if (trackKey) xhrs[trackKey] = xhr;

      return new Promise((resolve, reject) => xhr
        .done(collection => resolve(collection.map(model => model.attributes), collection.state))
        .fail(reject)
      );
    };
  },
};
