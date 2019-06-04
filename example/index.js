const {
  BrainstemCollection,
  StorageManager,
} = require('brainstem-js');

const {
  applyMiddleware,
  combineReducers,
  createStore,
} = require('redux');

const thunkMiddleware = require('redux-thunk').default;
const syncBrainstemMiddleware = require('../lib/middleware/update-storage-manager').default;
const loggerMiddleware = require('./middleware/logger').default;

const Post = require('./models/post').default;
const Posts = require('./collections/posts').default;
const Users = require('./collections/users').default;

const storageManager = StorageManager.get();
storageManager.addCollection('posts', Posts);
storageManager.addCollection('users', Users);

const store = createStore(
  combineReducers({
    brainstem: require('../lib/reducers/index').default,
    postsAutocompleter: require('./reducers/posts-autocompleter').default,
  }),
  applyMiddleware(
    thunkMiddleware,
    syncBrainstemMiddleware,
    loggerMiddleware
  )
);

// Transforms a storage manager backbone event into a (dispatched) redux brainstem action
require('../lib/sync/update-store').default(store);

const posts = storageManager.storage('posts');
posts.add({ id: 1, title: 'What is redux?', message: 'I do not know but it might be awesome' });
posts.add({ id: 42, title: 'Life is good', message: 'Gooooood' });

const users = storageManager.storage('users');
const user = users.add({ id: 1, username: 'acid-burn', email: 'acid-burn@hackers.net', address: { city: 'SF', state: 'CA' } });

user.set({ username: 'Acid-Burn' }); // change event
user.set({ username: 'Acid-Burn2', email: 'acid-burn2@hackers.net' }); // change event
user.set({ address: { city: 'SLC', state: 'UT' } }); // change event

posts.remove(posts.first());

store.dispatch({
  type: 'ADD_MODEL',
  payload: {
    brainstemKey: 'posts',
    attributes: { id: 76, title: 'Hello', message: 'World!' },
  },
});
storageManager.storage('posts').add({ id: 97, title: 'World?', message: 'I live everywhere!' });

storageManager.enableExpectations();

const getMatchingPosts = (text) => {
  return [
    new Post({ id: 900, message: 'woah' }),
    new Post({ id: 901, message: 'woah!' }),
    new Post({ id: 902, message: 'i am an autocomplete post' }),
    new Post({ id: 903, message: 'whos an autocomplete post' }),
    new Post({ id: 904, message: 'you are not an autocomplete post' }),
    new Post({ id: 905, message: 'no' }),
  ].filter(postModel => postModel.get('message').indexOf(text) > -1);
};

storageManager.stub('posts', {
  search: '',
  immediate: true,
  response(responseBody) {
    responseBody.results = [];
  },
});

storageManager.stub('posts', {
  search: 'w',
  immediate: true,
  response(responseBody) {
    responseBody.results = getMatchingPosts('w');
  },
});

storageManager.stub('posts', {
  search: 'wo',
  immediate: true,
  response(responseBody) {
    responseBody.results = getMatchingPosts('woah');
  },
});

storageManager.stub('posts', {
  search: 'a',
  immediate: true,
  response(responseBody) {
    responseBody.results = getMatchingPosts('a');
  },
});

storageManager.stub('posts', {
  search: 'au',
  immediate: true,
  response(responseBody) {
    responseBody.results = getMatchingPosts('auto');
  },
});

storageManager.stub('posts', {
  search: 'n',
  immediate: true,
  response(responseBody) {
    responseBody.results = getMatchingPosts('n');
  },
});

const React = require('react');
const ReactDom = require('react-dom');

document.addEventListener('DOMContentLoaded', (event) => {
  const { Provider } = require('react-redux');
  const AllPostsBox = require('./containers/all-posts-box').default;

  ReactDom.render(
    React.createElement(Provider, { store },
      React.createElement(AllPostsBox, null)
    ),
    document.getElementById('all-posts-list')
  );


  const AutocompletePostsList = require('./containers/all-posts-autocomplete-box').default;

  ReactDom.render(
    React.createElement(Provider, { store },
      React.createElement(AutocompletePostsList, null)
    ),
    document.getElementById('autocomplete-posts-list')
  );
});
