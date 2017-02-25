# brainstem-redux

- Brainstem-redux syncs data between your Brainstem storage manager and your Redux store
- Provides [(thunked) action creators](http://redux.js.org/docs/advanced/AsyncActions.html)
  - Model fetching
  - Model saving
  - Collection fetching

[![npm version](https://img.shields.io/npm/v/brainstem-redux.svg?style=flat-square)](https://www.npmjs.com/package/brainstem-redux)
[![npm downloads](https://img.shields.io/npm/dm/brainstem-redux.svg?style=flat-square)](https://www.npmjs.com/package/brainstem-redux)

## Dependencies

    npm install --save brainstem-js redux redux-thunk

## Usage

### Use Brainstem-redux when creating your top-level reducer and your store. 

1. Apply the brainstem-redux reducer with the key of `brainstem`. 
2. When you create your store, apply the `updateStorageManager` middleware (syncs store -> storage manager)
3. Finally, set up event handlers to sync the storage manager -> store

```
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

### Use Brainstem-redux action creators

When you want to fetch or save your models or fetch your collections, use the `modelActions` and `collectionActions` to make sure both your store and storage manager get updated. These action creators feature a few things to facilitate most common usages of fetch / save. 

Each action creator takes an object of options. 

 - `fetchOptions` (object) - fetch options
 - `trackKey` (string) - unique key to track XHR requests where existing XHRs with the same key are cancelled
 - `preFetchAction` (action) - action to dispatch before sending the XHR
 - `postFetchAction` (action creator) - action creator to dispatch after successfully sending the XHR; invoked with the relevant results (e.g. model ID or IDs) 

1. Fetch a model

```
const { modelActions } = require('brainstem-redux')

modelActions.fetch('posts', 42, { 
  fetchOptions: { 
    include: ['subject'] 
  }
})
```

1. Save a model (create)

```
const { modelActions } = require('brainstem-redux')

modelActions.save('posts', 42, { 
  title: 'New post'
})
```

1. Save a model (update)

```
const { modelActions } = require('brainstem-redux')

modelActions.save('posts', 42, { 
  title: 'Update post'
})
```
* Note that `update` creates a new Brainstem model and will not make a request if the model is [invalid](https://github.com/mavenlink/brainstem-redux/blob/master/lib/actions/model.js#L53-L58). Adding a reject handler addresses this locally.
* Note that `update` will override optional attributes, so you will need the original model's attributes

1. Fetch a collection

```
const { collectionActions } = require('brainstem-redux')

modelActions.fetch('posts', { 
  fetchOptions: { 
    include: ['subject'] 
  }
})
```

## API
`brainstem-redux` exposes five methods:

1. `reducer`: store reducer which manages the top-level `brainstem` slice of the store
2. `updateStore`: event handling of all the collections in your storage manager; dispatches the appropriate actions to the redux store
3. `updateStorageManager`: *middleware* that syncs the redux store with your storage manager
4. `modelActions`: action creators for your models
5. `collectionActions`: action creators for your collections
