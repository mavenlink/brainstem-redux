import { StorageManager } from 'brainstem-js';

const brainstemStoreReducer = (brainstemStore, name) => (
  { ...brainstemStore, [name]: {} }
);

export default () => StorageManager.get().collectionNames().reduce(brainstemStoreReducer, {});
