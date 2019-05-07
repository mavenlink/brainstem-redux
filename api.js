import reReducer from './lib/reducers';
import usUpdateStore from './lib/sync/update-store';
import smUpdateStorageManager from './lib/middleware/update-storage-manager';
import btMakeBrainstemType from './lib/types/make-brainstem-type';

import {
  fetch as mFetch,
  save as mSave,
  destroy as mDestroy,
  validate as mValidate,
} from './lib/actions/model';

import cCollectionActions from './lib/actions/collection';
import usStopUpdateStore from './lib/sync/stop-update-store';

export const reducer = reReducer;
export const updateStore = usUpdateStore;
export const updateStorageManager = smUpdateStorageManager;
export const makeBrainstemType = btMakeBrainstemType;

// actions/model
export const fetch = mFetch;
export const save = mSave;
export const destroy = mDestroy;
export const validate = mValidate;
export const fetchCollection = cCollectionActions;
export const stopUpdateStore = usStopUpdateStore;
