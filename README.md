# Brainstem-redux

- Brainstem-redux syncs data between your Brainstem `storageManager` and your Redux `store`.
- Provides [(thunked) action creators](http://redux.js.org/docs/advanced/AsyncActions.html)
  - Model fetching
  - Model saving
  - Collection fetching

## Dependencies

    npm install --save brainstem-js redux redux-thunk

## Usage

### Use Brainstem-redux when creating your top-level reducer and your store. 

1. Apply the brainstem-redux reducer with the key of `brainstem`. 
2. When you create your store, apply the `updateStorageManager` middleware (syncs `store` -> `storageManager`)
3. Finally, set up event handlers to sync the `storeManager` -> `store`

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

When you want to fetch or save your models or fetch your collections, use the `modelActions` and `collectionActions` to make sure both your store and storageManager get updated.

## API
Brainstem-redux exposes five methods:
1. `reducer`: reducer that can be mixed into your own reducer and will hold all of the data in your storageManager
2. `updateStore`: function that loops through all of the collections in your storageManager and sets up event listeners that will dispatch the appropriate actions to your store when your storageManager emits events
3. `updateStorageManager`: middleware that updates your storageManager based on the actions you dispatch to your store
4. `modelActions`: methods that dispatch actions for your models to your store
5. `collectionActions`: methods that dispatch actions for your collections to your store
