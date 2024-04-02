export default (state, action) => {
  const { brainstemKey, attributes } = action.payload;

  const modelsMap = {
    ...state[brainstemKey],
    [attributes.id]: attributes,
  };

  return { ...state, [brainstemKey]: modelsMap };
};
