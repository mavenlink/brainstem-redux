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
