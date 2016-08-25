const generateInitialState = require('./brainstem-store-generator');
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


module.exports = (storageManager) => (state = generateInitialState(storageManager), action) => {
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

  const modelsMap = Object.assign({},
    state[brainstemKey], // copy of old state of brainstemKey (i.e. brainstem.posts)
    { [id]: attributes }          // clobber the only thing that changed
  );

  // copy old brainstem state and clobber the brainstemKey that changed
  return Object.assign({}, state, {
    [brainstemKey]: modelsMap
  });
}

removeModel = (state, brainstemKey, attributes) => {
  const { id } = attributes;

  const modelsMap = Object.assign({}, state[brainstemKey]);
  delete modelsMap[id]; // Should not violate `const` declaration

  return Object.assign({}, state, {
    [brainstemKey]: modelsMap
  });
}
