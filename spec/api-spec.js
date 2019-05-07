import * as index from '../api';

describe('API', () => {
  it('has all the methods', () => {
    expect(typeof index.reducer).toEqual('function');
    expect(typeof index.updateStore).toEqual('function');
    expect(typeof index.updateStorageManager).toEqual('function');
    expect(typeof index.stopUpdateStore).toEqual('function');
    expect(typeof index.makeBrainstemType).toEqual('function');
    expect(index.fetch).toBeDefined();
    expect(index.destroy).toBeDefined();
    expect(index.validate).toBeDefined();
    expect(index.save).toBeDefined();
    expect(index.fetchCollection).toBeDefined();
  });
});
