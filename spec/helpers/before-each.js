const {
  StorageManager,
} = require('brainstem-js');

const {
  applyMiddleware,
  combineReducers,
  createStore,
} = require('redux');

const thunkMiddleware = require('redux-thunk').default;
const syncBrainstemMiddleware = require('../../lib/middleware/update-storage-manager');
const brainstemReducers = require('../../lib/reducers');

const Posts = require('../../example/collections/posts');
const Users = require('../../example/collections/users');
const postsAutocompleterReducers = require('../../example/reducers/posts-autocompleter');

const updateStoreSync = require('../../lib/sync/update-store');

module.exports = function () {
  this.storageManager = StorageManager.get();
  this.storageManager.addCollection('posts', Posts);
  this.storageManager.addCollection('users', Users);

  this.store = createStore(
    combineReducers({
      brainstem: brainstemReducers,
      postsAutocompleter: postsAutocompleterReducers,
    }),
    applyMiddleware(
      thunkMiddleware,
      syncBrainstemMiddleware
    )
  );

  // Transforms a storage manager backbone event into a (dispatched) redux brainstem action
  updateStoreSync(this.store);
};
