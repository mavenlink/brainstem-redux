export default (state, action) => {
  const mergedCollections = {};
  const { collections } = action.payload;
  const collectionNames = Object.keys(collections);

  collectionNames.forEach((collectionName) => {
    const newCollection = { ...state[collectionName] };
    Object.keys(collections[collectionName]).forEach((id) => {
      newCollection[id] = { ...newCollection[id], ...collections[collectionName][id] };
    });
    mergedCollections[collectionName] = newCollection;
  });

  return { ...state, ...mergedCollections };
};
