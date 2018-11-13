import { StorageManager } from 'brainstem-js';
import { applyMiddleware, combineReducers, createStore } from 'redux';

import thunkMiddleware from 'redux-thunk';
import syncBrainstemMiddleware from '../../lib/middleware/update-storage-manager';
import brainstemReducers from '../../lib/reducers';

import Posts from '../../example/collections/posts';
import Users from '../../example/collections/users';
import postsAutocompleterReducers from '../../example/reducers/posts-autocompleter';

import updateStoreSync from '../../lib/sync/update-store';

export default function () {
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
}
