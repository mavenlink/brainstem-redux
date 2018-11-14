export default (state, action) => {
  const mergedCollections = {};
  const { collections } = action.payload;
  const collectionNames = Object.keys(collections);

  collectionNames.forEach((collectionName) => {
    const newCollection = Object.assign({}, state[collectionName]);
    Object.keys(collections[collectionName]).forEach((id) => {
      newCollection[id] = Object.assign({}, newCollection[id], collections[collectionName][id]);
    });
    mergedCollections[collectionName] = newCollection;
  });

  return Object.assign({}, state, mergedCollections);
};
