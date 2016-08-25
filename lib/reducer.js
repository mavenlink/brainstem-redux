module.exports = initialState =>  (state = initialState, action) => {
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
    newState.brainstem[brainstemKey], // copy of old state
    { [id]: attributes } // only thing that changed
  );

  return newState;
}

removeModel = (state, brainstemKey, attributes) => {
  const { id } = attributes;

  let newState = Object.assign({}, state);

  let models = Object.assign({}, newState.brainstem[brainstemKey]);

  delete models[id];

  newState.brainstem[brainstemKey] = models;

  return newState;
}
