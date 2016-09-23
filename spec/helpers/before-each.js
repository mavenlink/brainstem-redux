const {
  StorageManager,
} = require('brainstem-js');

const {
  applyMiddleware,
  combineReducers,
  createStore,
} = require('redux');


const thunkMiddleware = require('redux-thunk').default;

const Posts = require('../../example/collections/posts');
const Users = require('../../example/collections/users');

beforeEach(function() {
  this.storageManager = StorageManager.get();
  this.storageManager.addCollection('posts', Posts);
  this.storageManager.addCollection('users', Users);

  this.store = createStore(
    combineReducers({
      brainstem: require('../../lib/reducers/index')(this.storageManager),
      postsAutocompleter: require('../../example/reducers/posts-autocompleter'),
    }),
    applyMiddleware(
      thunkMiddleware
    )
  );

  // Transforms a storage manager backbone event into a (dispatched) redux brainstem action
  require('../../lib/sync/event-handler')(this.storageManager, this.store);
  // Redux change listening to sync the redux brainstem store into the storage manager
  require('../../lib/sync/subscriber')(this.storageManager, this.store);
});
