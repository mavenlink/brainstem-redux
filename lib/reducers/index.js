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

import updateModel from './update-model';
import syncCollections from './sync-collections';
import removeModel from './remove-model';
import initialState from './initial-state';

export default (state = initialState(), action) => {
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
