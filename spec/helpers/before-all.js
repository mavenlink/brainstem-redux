beforeAll(() => {
  const {
    StorageManager,
  } = require('brainstem-js');

  const {
    applyMiddleware,
    combineReducers,
    createStore,
  } = require('redux');

  const thunkMiddleware = require('redux-thunk').default;
  const loggerMiddleware = require('../../example/middleware/logger');

  const Posts = require('../../example/collections/posts');
  const Users = require('../../example/collections/users');

  storageManager = StorageManager.get();
  storageManager.addCollection('posts', Posts);
  storageManager.addCollection('users', Users);

  store = createStore(
    combineReducers({
      brainstem: require('../../lib/reducers/index')(storageManager),
      postsAutocompleter: require('../../example/reducers/posts-autocompleter'),
    }),
    applyMiddleware(
      thunkMiddleware,
      loggerMiddleware
    )
  );
});
