const storageManager = require('brainstem-js').StorageManager.get();

module.exports = (store) => {
  for (const collectionName of storageManager.collectionNames()) {
    storageManager.storage(collectionName).on('all', (eventName, entity) => {
      if (eventName.indexOf(':') > -1) return;

      // Heuristic for the time being
      if (entity !== undefined
          && typeof entity.attributes === 'object'
          && entity.attributes) {
        store.dispatch({
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
        store.dispatch({
          type: `${eventName.toUpperCase()}_COLLECTION`,
          meta: {
            origin: 'storageManager',
          },
        });
      }
    });
  }
};
