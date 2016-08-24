/*

store := {
  brainstem: {
    stories: {
      1: {
        title: 'foo 1',
        status: 'completed'
      },
      42: {
        attributes: {
          id: 42,
          title: 'foo 2',
          status: 'not started'
        },
        state: 'sync' | 'request'
      }
    },
    posts: {},
    users: {
      1: {
        username: 'Bob McBobster',
        email: 'bob@bobster.com',
      }
    }
  },
  task-tracker: {}
}


As a migration tool:
  - Listens on all data known to brainstem-js storage manager
  - Propagates changes to brainstem-js storage manager


## Synchronous

Listening:
  - Assuming the storage manager is set up
    - access it (globally?)
    - set up event handlers by using Backbone.Events


Propagation:
  - Subscribe to store (?)
  - Set appropriate model(s) data (change)
  - Update appropriate collections (add, remove)


## Asynchronous (make sure it works?)

Brainstem.Collection makes a fetch -> server responds with a brainstem payload
Storage manager parses the payload and updates its contents
Models emit a change event. Collections emit a change event.



# Version 0.1.0

Since Brainstem-js is tightly coupled with Backbone.Sync, the storage manager
will be driving the redux store:

- Each event handler will be its own action


# Version 0.2.0

The redux store can drive the storage manager

- Listener on store can update the storage manager
- or, Middleware can update the storage manager?

- Since each event handler has its own action, dispatched actions should also
  emit an event or invoke a method on the storage manager (but avoid cyclical
  flow?)


# Version ?.?.?

Since Brainstem-js is tightly coupled with Backbone.Sync
So decouple as `Brainstem.Sync`

*/

/*

action := {
  type: 'ADD_POST',
  attributes: {
    id: 1,
    title: 'I am a post',
    message: 'A fancy post!'
  }
}


*/

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

reducer = (state = DEFAULT_STATE, action) => {
  const { brainstemKey, attributes } = action;
  switch (action.type) {
    case 'ADD_MODEL':
    case 'CHANGE_MODEL':
      return updateModel(state, brainstemKey, attributes);
    case 'REMOVE_MODEL':
      return removeModel(state, brainstemKey, attributes);
    default:
      return state;
  }
}

updateModel = (state, brainstemKey, attributes) => {
  const { id } = attributes;

  let newState = Object.assign({}, state);

  Object.assign(
    newState.brainstem[brainstemKey], // copy of old state
    { [id]: attributes } // only thing that changed
  );

  return newState;
}

removeModel = (state, brainstemKey, attributes) => {
  const { id } = attributes;

  let newState = Object.assign({}, state);

  let models = Object.assign({}, newState.brainstem[brainstemKey]);

  delete models[id];

  newState.brainstem[brainstemKey] = models;

  return newState;
}

const logger = store => next => action => {
  console.log('dispatching', action)
  let result = next(action)
  console.log('next state', store.getState())
  return result
}

store = createStore(
  reducer,
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

// // REACT -> STORAGE MANAGER
// React updates posts -> store gets updated
// Store invokes all listeners
// Listener tries to update all models on storage manager
// Changed post actually updates and emits a change event
// Change event is handled by dispatched a CHANGE_MODEL action
// Store invokes all listeners
// Listener tries to update all models on storage manager
// Post does not change so backbone does not emit any event

// // STORAGE MANAGER -> REACT
// Storage manager emits a change event
// Change event is handled by dispatching a CHANGE_MODEL action
// Store is updated
// Store invokes all listeners
// Listener tries to update all models on storage manager
// Model does not change so backbone does not emit any event

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

const React = require('react')
const ReactDom = require('react-dom')

document.addEventListener('DOMContentLoaded', function(event) {
  const PostBox = require('./example/post-box')

  postBoxOptions = {
    posts: [
      { id: 1, title: 'Imma Post', message: 'Gimme mo post' },
      { id: 2, title: 'Imma Post', message: 'Gimme mo post' },
      { id: 3, title: 'Imma Post', message: 'Gimme mo post' },
      { id: 4, title: 'Imma Post', message: 'Gimme mo post' },
      { id: 5, title: 'Imma Post', message: 'Gimme mo post' },
      { id: 6, title: 'Imma Post', message: 'Gimme mo post' },
      { id: 7, title: 'Imma Post', message: 'Gimme mo post' },
      { id: 8, title: 'Imma Post', message: 'Gimme mo post' },
      { id: 9, title: 'Imma Post', message: 'Gimme mo post' },
      { id: 21, title: 'Imma Post', message: 'Gimme mo post' },
      { id: 22, title: 'Imma Post', message: 'Gimme mo post' },
    ]
  }

  ReactDom.render(
    React.createElement(PostBox, postBoxOptions),
    document.getElementById('all-posts-list')
  );
});
