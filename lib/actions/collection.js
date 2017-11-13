const { StorageManager } = require('brainstem-js');

const xhrs = {};

const storageManagerAdapter = {
  fetchCollection: (brainstemKey, options) => {
    const storageManager = StorageManager.get();
    return storageManager.storage(brainstemKey)
      .fetch(Object.assign(options.fetchOptions, { remove: false }));
  },
};

module.exports = {
  fetch(brainstemKey, options = {}) {
    const {
      fetchOptions = {},
      postFetchAction,
      preFetchAction,
      trackKey,
      adapter = storageManagerAdapter,
    } = options;

    if (xhrs[trackKey] && xhrs[trackKey].state() === 'pending') xhrs[trackKey].abort();

    return (dispatch) => {
      if (preFetchAction) dispatch(preFetchAction);

      const xhr = adapter.fetchCollection(brainstemKey, { fetchOptions });

      if (postFetchAction) xhr.done(collection => dispatch(postFetchAction(collection.pluck('id'))));

      if (trackKey) xhrs[trackKey] = xhr;

      return new Promise((resolve, reject) => xhr
        .done(collection => resolve(collection.map(model => model.attributes)))
        .fail(reject)
      );
    };
  },
};
