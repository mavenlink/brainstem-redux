var index = require('../api.js');

describe('API', function() {
  it('has all the methods', function() {
    expect(typeof index.reducer).toEqual('function');
    expect(typeof index.updateStore).toEqual('function');
    expect(typeof index.updateStorageManager).toEqual('function');
    expect(index.modelActions).toBeDefined();
    expect(index.collectionActions).toBeDefined();
  });
});
