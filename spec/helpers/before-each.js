const storageManager = require('../sync/storage-manager').retrieveStorageManager();

const {
  applyMiddleware,
  combineReducers,
  createStore,
} = require('redux');


const thunkMiddleware = require('redux-thunk').default;
const syncBrainstemMiddleware = require('lib/middleware/update-storage-manager');

const Posts = require('example/collections/posts');
const Users = require('example/collections/users');

beforeEach(function() {
  this.storageManager.addCollection('posts', Posts);
  this.storageManager.addCollection('users', Users);

  this.store = createStore(
    combineReducers({
      brainstem: require('lib/reducers/index'),
      postsAutocompleter: require('example/reducers/posts-autocompleter'),
    }),
    applyMiddleware(
      thunkMiddleware,
      syncBrainstemMiddleware
    )
  );

  // Transforms a storage manager backbone event into a (dispatched) redux brainstem action
  require('lib/sync/update-store')(this.store);
});
