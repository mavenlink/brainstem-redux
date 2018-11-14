import { StorageManager } from 'brainstem-js';

const brainstemStoreReducer = (brainstemStore, name) =>
  Object.assign({}, brainstemStore, { [name]: {} });

export default () => StorageManager.get().collectionNames().reduce(brainstemStoreReducer, {});
