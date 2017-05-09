const getStorageManagerListener = require('./../../lib/sync/storage-manager-listener');

describe('storageManagerListener', () => {
  it('returns a function', () => {
    expect(typeof getStorageManagerListener).toEqual('function');
  });

  describe('when a store is not passed in the first time it is invoked', () => {
    it('throws an error when nothing is passed in', () => {
      expect(() => getStorageManagerListener()).toThrow(new Error('You must pass in a redux store the first time you call getStorageManagerListener'));
    });

    it('throws an error when an object that is not a store is passed in', () => {
      expect(() => getStorageManagerListener({})).toThrow(new Error('You must pass in a redux store the first time you call getStorageManagerListener'));
    });
  });

  describe('when a store is passed in the first time it is invoked', () => {
    it('returns the same function every time it is invoked after that', () => {
      const firstReturn = getStorageManagerListener({ dispatch: () => {} });
      expect(typeof firstReturn).toEqual('function');
      expect(getStorageManagerListener()).toBe(firstReturn);
      expect(getStorageManagerListener()).toBe(firstReturn);
      expect(getStorageManagerListener()).toBe(firstReturn);
    });
  });

  describe('when a store is passed in again', () => {
    describe('when it is the same store', () => {
      it('returns the same listener', () => {
        const store = { dispatch: () => {} };
        const listenerWithFirstStore = getStorageManagerListener(store);
        const listenerWithOtherStore = getStorageManagerListener(store);
        expect(listenerWithFirstStore).toBe(listenerWithOtherStore);
      });
    });

    describe('when it is a different store', () => {
      it('overrides the original store and returns a new handler bound to the new store', () => {
        const listenerWithFirstStore = getStorageManagerListener({ dispatch: () => {} });
        const listenerWithOtherStore = getStorageManagerListener({ dispatch: () => {} });
        expect(listenerWithFirstStore).not.toBe(listenerWithOtherStore);
      });
    });
  });
});
