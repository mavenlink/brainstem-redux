# brainstem-redux

- Brainstem-redux syncs data between your Brainstem storage manager and your Redux store
- Provides [(thunked) action creators](http://redux.js.org/docs/advanced/AsyncActions.html)
  - Model fetching
  - Model saving
  - Collection fetching
- Provides a "type creator" that provides functions for working with models and collections

[![npm version](https://img.shields.io/npm/v/brainstem-redux.svg?style=flat-square)](https://www.npmjs.com/package/brainstem-redux)
[![npm downloads](https://img.shields.io/npm/dm/brainstem-redux.svg?style=flat-square)](https://www.npmjs.com/package/brainstem-redux)

## Dependencies

    npm install --save brainstem-js redux redux-thunk

## Usage

### Use Brainstem-redux when creating your top-level reducer and your store.

1. Apply the brainstem-redux reducer with the key of `brainstem`.
2. When you create your store, apply the `updateStorageManager` middleware (syncs store -> storage manager)
3. Finally, set up event handlers to sync the storage manager -> store

```js
const {
  reducer: brainstemReducer,
  updateStore,
  updateStorageManager
} = require('brainstem-redux')

const {
  combineReducers,
  createStore,
  applyMiddleware
} = require('redux')

const thunkMiddleware = require('redux-thunk').default

// 1
const appReducer = combineReducers({
  brainstem: brainstemReducer,
  otherReducers: ...
})

// 2
const storeMiddleware = applyMiddleware(thunkMiddleware, updateStorageManager)

const store = createStore(appReducer, storeMiddleware)

// 3
require('lib/sync/update-store')(store);
```

### Create Brainstem-redux type objects

A "type" is a family of functions that operate on objects with a given shape.  In the case of this library, the objects will be the models and collections in the store.

Brainstem-redux provides `makeBrainstemType`, a factory function that returns an object containing a set of handy functions for working with your models and collections.

#### Creating a Type

To create a type, use `makeBrainstemType`:

```js
const { makeBrainstemType } = require('brainstem-redux');

module.exports = makeBrainstemType('posts');
```

If you want to add some of your own application-specific type functions, you can merge your functions using `Object.assign` or similar function:

```js
const { makeBrainstemType } = require('brainstem-redux');

function doSomethingWithPost(post) {
  // ...
}

module.exports = Object.assign({},
  makeBrainstemType('posts'),
  {
    doSomethingWithPost,
  },
);
```

`makeBrainstemType` also takes an optional `typeOptions` argument.
Currently, it supports a `filterPredicate` key that allows you to return only a subset of the models in a collection:

```js
const { makeBrainstemType } = require('brainstem-redux');

module.exports = makeBrainstemType('posts', { filterPredicate: post => !post.published });
```

#### Using a Type

Once you've defined your type, you can use its functions in your application.

**Action Creators**

`makeBrainstemType` provides action creators that wrap the `modelActions` and `collectionActions` discussed below.

- `fetchAll(options)`

Fetch a collection (wraps `collectionActions.fetch`).

```js
const { makeBrainstemType } = require('brainstem-redux');

const Post = makeBrainstemType('posts');

Post.fetchAll({
  fetchOptions: {
    include: ['subject']
  }
});
```

- `fetch(id, options)`

Fetch a model (wraps `modelActions.fetch`).

```js
const { makeBrainstemType } = require('brainstem-redux');

const Post = makeBrainstemType('posts');

Post.fetch(42, {
  fetchOptions: {
    include: ['subject']
  }
});
```

- `save(id, options)`

Save a model (wraps `modelActions.save`)

Creating a new model:
```js
const { makeBrainstemType } = require('brainstem-redux');

const Post = makeBrainstemType('posts');

Post.save(null, {
  title: 'New post'
});
```

Updating an existing model:
```js
const { makeBrainstemType } = require('brainstem-redux');

const Post = makeBrainstemType('posts');

Post.save(42, {
  title: 'Update post'
});
```

- `destroy(id)`

Destroy a model (wraps `modelActions.destroy`).

```js
const { makeBrainstemType } = require('brainstem-redux');

const Post = makeBrainstemType('posts');

Post.destroy(42);
```

**Selectors**

`makeBrainstemType` provides a number of [selectors](https://stackoverflow.com/a/38674427) for looking up models.

- `all(state)`

Get a lookup table of all objects.

**NOTE:** This will return all of the models in the Brainstem storage manager, so this should only be used as a lookup table when looking up associated objects, and not as the list of objects you need to display; rather, you should store a list of IDs in your state tree and use `findAll` or `findAllInState` to find the objects matching those IDs.

```js
const { makeBrainstemType } = require('brainstem-redux');

const User = makeBrainstemType('users');

function author(users, post) {
  return User.find(post.author_id, users);
}

const Post = Object.assign({},
  makeBrainstemType('posts'),
  {
    author
  }
);

// Elsewhere:
const post = Post.findInState(42, state);
const author = Post.author(User.all(state), post);
```

- `find(id, collection)`

Finds a model by its ID in a lookup object (such as that returned by `all`).

```js
const { makeBrainstemType } = require('brainstem-redux');

const User = makeBrainstemType('users');

function author(users, post) {
  return User.find(post.author_id, users);
}

// Elsewhere:
const author = Post.author(User.all(state), post);
```

- `findAll(ids, collection)`

Finds a list of models by their IDs in a lookup object (such as that returned by `all`).

```js
const { makeBrainstemType } = require('brainstem-redux');

const Tag = makeBrainstemType('tags');

function tags(allTags, post) {
  return Tag.findAll(post.tag_ids, allTags);
}

// Elsewhere:
const author = Post.tags(Tag.all(state), post);
```

- `findInState(id, state)`

Finds a model by its ID in the Redux state tree.  Assumes that the Brainstem data is at `state.brainstem`.

```js
const { makeBrainstemType } = require('brainstem-redux');

const Post = makeBrainstemType('posts');

Post.findInState(42, state);
```

- `findAllInState(ids, state)`

Finds a list of models by their IDs in the Redux state tree.

```js
const { makeBrainstemType } = require('brainstem-redux');

const Post = makeBrainstemType('posts');

Post.findAllInState(state.myApp.postIds, state);
```

- `findInList(id, list)`

Finds a model by its ID in a list of models.

```js
const { makeBrainstemType } = require('brainstem-redux');

const Post = makeBrainstemType('posts');

const posts = Post.findAllInState(state.myApp.postIds, state);
const selectedPost = Post.findInList(state.myApp.selectedPostId, posts);
```

**Reducer Helper**

Sometimes, you'd like to have one of your application's reducers respond to an action generated by Brainstem-redux (such as `SYNC_MODEL` or `REMOVE_MODEL`, for example).

In order to make it easier to determine if the action is appropriate for the model you're working with, you can use `matchesAction` in your reducer.

```js
const { makeBrainstemType } = require('brainstem-redux');

const Post = makeBrainstemType('posts');

function reducer(state, action) {
  switch (action.type) {
    case: 'SYNC_MODEL':
      return Post.matchesAction(action) : doSomething(state, action) : state;
    // ...
    default:
      return state;
  }
}
```

**Test Helpers**

In order to test reducers that respond to Brainstem-redux actions, you need to be able to create actions that match what Brainstem-redux creates.

- `removeModel(model)`

Creates a properly-formed `REMOVE_MODEL` action.

```js
const { makeBrainstemType } = require('brainstem-redux');
const reducer = require('./reducer');

const Post = makeBrainstemType('posts');

describe('My reducer', () => {
  it('removes a model', () => {
    const post = { id: '42', title: 'A Post' };
    const initialState = { postIds: ['42', '58'] };
    const action = Post.removeModel(post);
    const newState = reducer(initialState, action);

    expect(newState).toEqual(['58']);
  });
});
```

- `syncModel(model)`

Creates a properly-formed `SYNC_MODEL` action.

```js
const { makeBrainstemType } = require('brainstem-redux');
const reducer = require('./reducer');

const Post = makeBrainstemType('posts');

describe('My reducer', () => {
  it('removes a model', () => {
    const post = { id: '42', title: 'A Post' };
    const initialState = { postIds: ['58'] };
    const action = Post.syncModel(post);
    const newState = reducer(initialState, action);

    expect(newState).toEqual(['58', '42']);
  });
});
```

### Use Brainstem-redux action creators

When you want to fetch, save, or destroy your models or fetch your collections, use the `modelActions` and `collectionActions` to make sure both your store and storage manager get updated. These action creators feature a few things to facilitate most common usages of fetch / save / destroy.

Each action creator takes an object of options.

 - `fetchOptions` (object) - fetch options
 - `trackKey` (string) - unique key to track XHR requests where existing XHRs with the same key are cancelled
 - `preFetchAction` (action) - action to dispatch before sending the XHR
 - `postFetchAction` (action creator) - action creator to dispatch after successfully sending the XHR; invoked with the relevant results (e.g. model ID or IDs)

* Fetch a model

```js
const { modelActions } = require('brainstem-redux')

modelActions.fetch('posts', 42, {
  fetchOptions: {
    include: ['subject']
  }
})
```

* Save a model (create)

```js
const { modelActions } = require('brainstem-redux')

modelActions.save('posts', null, {
  title: 'New post'
})
```

* Save a model (update)
  * Note that `update` creates a new Brainstem model and will not make a request if the model is [invalid](https://github.com/mavenlink/brainstem-redux/blob/master/lib/actions/model.js#L53-L58). Adding a reject handler addresses this locally.


```js
const { modelActions } = require('brainstem-redux')

modelActions.save('posts', 42, {
  title: 'Update post'
})
```

* Destroy a model

```js
const { modelActions } = require('brainstem-redux')

modelActions.destroy('posts', 42)
```

* Fetch a collection

```js
const { collectionActions } = require('brainstem-redux')

collectionActions.fetch('posts', {
  fetchOptions: {
    include: ['subject']
  }
})
```

## API
`brainstem-redux` API:

1. `reducer`: store reducer which manages the top-level `brainstem` slice of the store
2. `updateStore`: event handling of all the collections in your storage manager; dispatches the appropriate actions to the redux store
3. `stopUpdateStore`: helper function to stop updating your redux store from your storage manager; invoke with your redux store as the first argument (useful for test cleanup)
4. `updateStorageManager`: *middleware* that syncs the redux store with your storage manager
5. `makeBrainstemType`: creates a set of action creators, selectors, and reducer helpers to work with your models
6. `modelActions`: action creators for your models
7. `collectionActions`: action creators for your collections

## Local Development

In order to develop against a local checkout, run `yarn link` in `brainstem-redux`, then `yarn link brainstem-redux` in the project you want to use it in and restart webpack. Also, make sure to `yarn compile` when making changes in `brainstem-redux`.

## Running example

1. run `yarn start`
2. navigate to `http://localhost:8080/webpack-dev-server/`
3. click on `example`
4. view example app and type an approved string into the search bar 
