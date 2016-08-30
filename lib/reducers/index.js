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

const initialState = require('./initial-state')(storageManager);

const updateModel = require('./update-model')
const removeModel = require('./remove-model')

module.exports = (storageManager) => (state = initialState, { type, brainstemKey, attributes }) => {
  switch (type) {
    case 'ADD_MODEL':
    case 'CHANGE_MODEL':
      return updateModel(state, brainstemKey, attributes);
    case 'REMOVE_MODEL':
      return removeModel(state, brainstemKey, attributes);
    default:
      return state;
  }
}
