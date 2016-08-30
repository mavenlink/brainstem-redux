module.exports = (state, brainstemKey, attributes) => {
  const { id } = attributes;

  const modelsMap = Object.assign({}, state[brainstemKey]);
  delete modelsMap[id];

  return Object.assign({}, state, {
    [brainstemKey]: modelsMap
  });
}
