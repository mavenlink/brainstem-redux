BrainstemModel = require('brainstem-js').Model;
BrainstemCollection = require('brainstem-js').Collection;
StorageManager = require('brainstem-js').StorageManager;

storageManager = StorageManager.get();

Post = BrainstemModel.extend({
  paramRoot: 'post',
  brainstemKey: 'posts',
  urlRoot: '/api/v1/posts'
});

Posts = BrainstemCollection.extend({
  model: Post,
  url: '/api/v1/posts'
});

storageManager.addCollection('posts', Posts);

User = BrainstemModel.extend({
  paramRoot: 'user',
  brainstemKey: 'users',
  urlRoot: '/api/v1/users'
});

Users = BrainstemCollection.extend({
  model: User,
  url: '/api/v1/users'
});

storageManager.addCollection('users', Users);

const { createStore, applyMiddleware } = require('redux')

DEFAULT_STATE = {
  brainstem: {
    posts: {
    },
    users: {
    }
  }
}

const logger = store => next => action => {
  console.log('dispatching', action)
  let result = next(action)
  console.log('next state', store.getState())
  return result
}

store = createStore(
  require('./lib/reducer'),
  applyMiddleware(logger)
)

store.subscribe(() => {
  const brainstemTree = store.getState().brainstem;

  for (let brainstemKey in brainstemTree) {
    const models = brainstemTree[brainstemKey];
    const collection = storageManager.storage(brainstemKey);

    for (let modelId in models) {
      const modelAttributes = models[modelId];
      const existingModel = collection.get(modelId);

      if (existingModel) {
        existingModel.set(modelAttributes);
      } else {
        collection.add(modelAttributes);
      }
    }

    const reduxModelIds = Object.keys(models);
    const storageModelIds = collection.pluck('id');
    const removedIds = storageModelIds.filter(id => {
      return reduxModelIds.indexOf(String(id)) == -1
    });

    for (let removedId of removedIds) {
      collection.remove(removedId);
    }
  }
});

collectionNames = storageManager.collectionNames()

for (let collectionName of collectionNames) {
  storageManager.storage(collectionName).on('all', (eventName, model) => {
    if (!(model instanceof BrainstemModel)) return;

    store.dispatch({
      type: eventName.toUpperCase() + '_MODEL',
      brainstemKey: model.brainstemKey,
      attributes: model.toJSON(),
    });
  });
}

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
