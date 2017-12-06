module.exports = (state, action) => {
  const mergedCollections = {};
  const { collections } = action.payload;
  const collectionNames = Object.keys(collections);

  collectionNames.forEach((collectionName) => {
    mergedCollections[collectionName] = Object.assign(
      {},
      state[collectionName],
      collections[collectionName],
    );
  });

  return Object.assign({}, state, mergedCollections);
};
