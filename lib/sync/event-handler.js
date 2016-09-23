module.exports = (storageManager, store) => {
  for (let collectionName of storageManager.collectionNames()) {
    storageManager.storage(collectionName).on('all', (eventName, entity) => {
      if (eventName.indexOf(':') > -1) return;

      if (entity.attributes) // Heuristic for the time being
        store.dispatch({
          type: eventName.toUpperCase() + '_MODEL',
          brainstemKey: entity.brainstemKey,
          attributes: entity.toJSON(),
        });
      else
        store.dispatch({
          type: eventName.toUpperCase() + '_COLLECTION',
        });
    });
  }
}
