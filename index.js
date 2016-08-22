/*

store := {
  brainstem: {
    models: {
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
      posts: {}
    },
    collections: {
      stories: {
        ids: [{ type: story, id: 1 }, ref:42],
        state: 'sync' | 'request'
      },
      posts: [53, 89]
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


createStore = require('redux').createStore;

DEFAULT_STATE = {
  brainstem: {
    models: {
      posts: {
      },
      users: {
      }
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
    newState.brainstem.models[brainstemKey], // copy of old state
    { [id]: attributes } // only thing that changed
  );

  return newState;
}

removeModel = (state, brainstemKey, attributes) => {
  const { id } = attributes;

  let newState = Object.assign({}, state);

  let models = Object.assign({}, newState.brainstem.models[brainstemKey]);

  delete models[id];

  newState.brainstem.models[brainstemKey] = models;

  return newState;
}

store = createStore(reducer)

collectionNames = storageManager.collectionNames()

for (let collectionName of collectionNames) {
  storageManager.storage(collectionName).on('all', (eventName, model) => {
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
