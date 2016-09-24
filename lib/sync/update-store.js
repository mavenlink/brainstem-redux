const storageManager = require('brainstem-js').StorageManager.get()

module.exports = (store) => {
  for (let collectionName of storageManager.collectionNames()) {
    storageManager.storage(collectionName).on('all', (eventName, entity) => {
      if (eventName.indexOf(':') > -1) return;

      if (entity.attributes) // Heuristic for the time being
        store.dispatch({
          type: eventName.toUpperCase() + '_MODEL',
          payload: {
            brainstemKey: entity.brainstemKey,
            attributes: entity.toJSON(),
          },
          meta: {
            origin: 'storageManager'
          }
        });
      else
        store.dispatch({
          type: eventName.toUpperCase() + '_COLLECTION',
          meta: {
            origin: 'storageManager'
          }
        });
    });
  }
}
