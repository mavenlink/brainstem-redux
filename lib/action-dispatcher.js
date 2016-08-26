BrainstemModel = require('brainstem-js').Model;

module.exports = (storageManager, store) => {
  for (let collectionName of storageManager.collectionNames()) {
    storageManager.storage(collectionName).on('all', (eventName, entity) => {
      if (entity instanceof BrainstemModel)
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
