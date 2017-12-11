/*
  EXAMPLE STATE SLICE:

  state := {
    posts: {
      1: { ...attributes }
      76: { ...attributes }
    }
    users: {
      42: { ...attributes }
    }
  }

*/

const updateModel = require('./update-model');
const syncCollections = require('./sync-collections');
const removeModel = require('./remove-model');
const initialState = require('./initial-state');

module.exports = (state = initialState(), action) => {
  switch (action.type) {
    case 'COLLECTION_UPDATED':
      const { brainstemKey, models } = action.payload;

      const newModels = {};

      models.forEach(function(model) {
        newModels[model.id] = model.attributes;
      });

      const modelsMap = Object.assign({},
        state[brainstemKey],
        newModels,
      );

      return Object.assign({}, state, {
        [brainstemKey]: modelsMap,
      });
    case 'ADD_MODEL':
    case 'CHANGE_MODEL':
      return updateModel(state, action);
    case 'REMOVE_MODEL':
      return removeModel(state, action);
    case 'SYNC_COLLECTIONS':
      return syncCollections(state, action);
    default:
      return state;
  }
};
