export default (state, action) => {
  const { brainstemKey, attributes } = action.payload;

  const modelsMap = Object.assign({}, state[brainstemKey]);
  delete modelsMap[attributes.id];

  return Object.assign({}, state, {
    [brainstemKey]: modelsMap,
  });
};
