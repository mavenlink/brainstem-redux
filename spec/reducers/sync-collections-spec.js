const syncCollections = require('../../lib/reducers/sync-collections.js');

describe('syncCollections', () => {
  const initialState = { users: { 1: 'user1', 2: 'user2' } };
  const collectionsToMerge = {
    users: { 2: 'user20', 3: 'user3' },
    workspaces: { 1: 'w1', 2: 'w1' },
    roles: {},
  };

  it('merges collections into the state', () => {
    const action = {
      payload: {
        collections: collectionsToMerge,
      },
    };
    const expectedCollections = {
      users: { 1: 'user1', 2: 'user20', 3: 'user3' },
      workspaces: { 1: 'w1', 2: 'w1' },
      roles: {},
    };
    expect(syncCollections(initialState, action)).toEqual(expectedCollections);
  });
});
