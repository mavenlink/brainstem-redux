import syncCollections from '../../lib/reducers/sync-collections';

describe('syncCollections', () => {
  beforeEach(function () {
    this.initialState = { users: { 1: { name: 'user1' }, 2: { name: 'user2' } } };
  });

  const collectionsToMerge = {
    users: { 2: { name: 'user20' }, 3: { name: 'user3' } },
    workspaces: { 1: { name: 'w1' }, 2: { name: 'w1' } },
    roles: {},
  };

  it('merges collections into the state', function () {
    const action = {
      payload: {
        collections: collectionsToMerge,
      },
    };
    const expectedCollections = {
      users: { 1: { name: 'user1' }, 2: { name: 'user20' }, 3: { name: 'user3' } },
      workspaces: { 1: { name: 'w1' }, 2: { name: 'w1' } },
      roles: {},
    };
    expect(syncCollections(this.initialState, action)).toEqual(expectedCollections);
  });

  describe('when there are existing models in the collection', () => {
    beforeEach(function () {
      this.initialState = { users: { 1: { id: 1, oldAttribute: 'foo', newAttribute: 'bar' } } };
    });

    it('merges the new attributes onto the models', function () {
      const action = {
        payload: {
          collections: {
            users: {
              1: { id: 1, newAttribute: 'baz' },
            },
          },
        },
      };

      const expectedCollections = {
        users: { 1: { id: 1, oldAttribute: 'foo', newAttribute: 'baz' } },
      };

      expect(syncCollections(this.initialState, action)).toEqual(expectedCollections);
    });
  });
});
