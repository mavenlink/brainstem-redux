const reducer = require('./lib/reducers');
const updateStore = require('./lib/sync/update-store');
const updateStorageManager = require('./lib/middleware/update-storage-manager');
const modelActions = require('./lib/actions/model');
const collectionActions = require('./lib/actions/collection');

module.exports = {
  reducer,
  updateStore,
  updateStorageManager,
  modelActions,
  collectionActions,
};
