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

const updateModel = require('./update-model')
const removeModel = require('./remove-model')

module.exports = (storageManager) => {
  const initialState = require('./initial-state')(storageManager);

  return (state = initialState, action) => {
    switch (action.type) {
      case 'ADD_MODEL':
      case 'CHANGE_MODEL':
        return updateModel(state, action);
      case 'REMOVE_MODEL':
        return removeModel(state, action);
      default:
        return state;
    }
  };
}
