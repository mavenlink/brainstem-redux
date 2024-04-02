export default (state, action) => {
  const { brainstemKey, attributes } = action.payload;

  const modelsMap = { ...state[brainstemKey] };
  delete modelsMap[attributes.id];

  return { ...state, [brainstemKey]: modelsMap };
};
