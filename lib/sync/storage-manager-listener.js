let cachedStore;
let cachedListener;

export default function getStorageManagerListener(store) {
  if (cachedListener && (!store || store === cachedStore)) { return cachedListener; }

  if (!store || (typeof store.dispatch !== 'function')) { throw new Error('You must pass in a redux store the first time you call getStorageManagerListener'); }

  // we need to be able to reset the store with one that is passed in
  // so that we can reset the store between it blocks
  // For further explanation, this method should only ever be called once within app code
  // and is effectively a dependency we're injecting in since the callback below relies on this store being a singleton.
  // The listener is cached because it needs to be cleaned up between spec calls
  // to prevent intermittent failures and should persist throughout app code
  // since this is coupled with our singleton storage manager.
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
}
