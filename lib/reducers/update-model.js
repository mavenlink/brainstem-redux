module.exports = (state, brainstemKey, attributes) => {
  const { id } = attributes;

  const modelsMap = Object.assign({},
    state[brainstemKey],
    { [id]: attributes }
  );

  return Object.assign({}, state, {
    [brainstemKey]: modelsMap
  });
}
