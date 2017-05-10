let cachedStore;
let cachedListener;

module.exports = function getStorageManagerListener(store) {
  if (cachedListener && (!store || store === cachedStore)) { return cachedListener; }

  if (!store || (typeof store.dispatch !== 'function')) { throw new Error('You must pass in a redux store the first time you call getStorageManagerListener'); }

  // we need to be able to reset the store with one that is passed in
  // so that we can reset the store between it blocks
  cachedStore = store;
  cachedListener = function storageManagerListener(eventName, entity) {
    if (eventName.indexOf(':') > -1) return;

    // Heuristic for the time being
    if (entity !== undefined && entity.attributes) {
      cachedStore.dispatch({
        type: `${eventName.toUpperCase()}_MODEL`,
        payload: {
          brainstemKey: entity.brainstemKey,
          attributes: Object.assign({}, entity.attributes),
        },
        meta: {
          origin: 'storageManager',
        },
      });
    } else {
      cachedStore.dispatch({
        type: `${eventName.toUpperCase()}_COLLECTION`,
        meta: {
          origin: 'storageManager',
        },
      });
    }
  };

  return cachedListener;
};
