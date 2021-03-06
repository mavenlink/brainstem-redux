import * as index from '../index';

describe('API', () => {
  it('has all the methods', () => {
    expect(typeof index.reducer).toEqual('function');
    expect(typeof index.updateStore).toEqual('function');
    expect(typeof index.updateStorageManager).toEqual('function');
    expect(typeof index.stopUpdateStore).toEqual('function');
    expect(typeof index.makeBrainstemType).toEqual('function');
    expect(typeof index.collectionFetch).toEqual('function');
    expect(typeof index.modelDestroy).toEqual('function');
    expect(typeof index.modelFetch).toEqual('function');
    expect(typeof index.modelSave).toEqual('function');
    expect(typeof index.modelValidate).toEqual('function');
  });
});
