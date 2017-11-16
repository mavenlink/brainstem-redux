module.exports = (state, action) => {
  const mergedCollections = {};
  const { collections } = action.payload;
  const collectionNames = Object.keys(collections);

  collectionNames.forEach((collectionName) => {
    mergedCollections[collectionName] = {
      ...state[collectionName],
      ...collections[collectionName],
    };
  });

  return { ...state, ...mergedCollections };
};
