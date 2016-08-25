const {
  BrainstemCollection,
  StorageManager,
} = require('brainstem-js');

const {
  applyMiddleware,
  combineReducers,
  createStore,
} = require('redux');

const logger = require('./example/middleware/logger');
const Posts = require('./example/collections/posts');
const Users = require('./example/collections/users');

storageManager = StorageManager.get();
storageManager.addCollection('posts', Posts);
storageManager.addCollection('users', Users);

store = createStore(
  combineReducers({
    brainstem: require('./lib/reducer')(storageManager),
    postsAutocompleter: require('./example/reducers/posts-autocompleter'),
  }),
  applyMiddleware(logger)
);

// Transforms a storage manager backbone event into a (dispatched) redux brainstem action
require('./lib/action-dispatcher')(storageManager, store);
// Redux change listening to sync the redux brainstem store into the storage manager
require('./lib/sync-storage-manager')(storageManager, store);

posts = storageManager.storage('posts')
posts.add({ id: 1, title: 'What is redux?', message: 'I do not know but it might be awesome' });
posts.add({ id: 42, title: 'Life is good', message: 'Gooooood' });

users = storageManager.storage('users')
user = users.add({ id: 1, username: 'acid-burn', email: 'acid-burn@hackers.net', address: { city: 'SF', state: 'CA' } });

user.set({ username: 'Acid-Burn' }) // change event
user.set({ username: 'Acid-Burn2', email: 'acid-burn2@hackers.net' }) // change event
user.set({ address: { city: 'SLC', state: 'UT' } }) // change event

posts.remove(posts.first());

store.dispatch({ type: 'ADD_MODEL', brainstemKey: 'posts', attributes: { id: 76, title: 'Hello', message: 'World!' } })
storageManager.storage('posts').add({ id: 97, title: 'World?', message: 'I live everywhere!' })

const React = require('react')
const ReactDom = require('react-dom')

document.addEventListener('DOMContentLoaded', function(event) {
  const { Provider } = require('react-redux')
  const AllPostsBox = require('./example/containers/all-posts-box')

  ReactDom.render(
    React.createElement(Provider, { store: store },
      React.createElement(AllPostsBox, null)
    ),
    document.getElementById('all-posts-list')
  );


  const AutocompletePostsList = require('./example/containers/all-posts-autocomplete-box')

  ReactDom.render(
    React.createElement(Provider, { store: store },
      React.createElement(AutocompletePostsList, null)
    ),
    document.getElementById('autocomplete-posts-list')
  );
});
