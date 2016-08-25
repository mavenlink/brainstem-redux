BrainstemModel = require('brainstem-js').Model;

module.exports = (storageManager, store) => {
  for (let collectionName of storageManager.collectionNames()) {
    storageManager.storage(collectionName).on('all', (eventName, model) => {
      if (!(model instanceof BrainstemModel)) return;

      store.dispatch({
        type: eventName.toUpperCase() + '_MODEL',
        brainstemKey: model.brainstemKey,
        attributes: model.toJSON(),
      });
    });
  }
}
