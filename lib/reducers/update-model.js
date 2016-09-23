module.exports = (state, action) => {
  const { brainstemKey, attributes } = action.payload;

  const modelsMap = Object.assign({},
    state[brainstemKey],
    { [attributes.id]: attributes }
  );

  return Object.assign({}, state, {
    [brainstemKey]: modelsMap
  });
}
