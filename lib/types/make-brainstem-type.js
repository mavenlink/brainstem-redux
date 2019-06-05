import isObject from 'lodash.isobject';
import { fetch as collectionFetch } from '../actions/collection';
import modelActions from '../actions/model';

const defaultTypeOptions = {
  filterPredicate: () => true,
};

export default function makeBrainstemType(brainstemKey, typeOptions = defaultTypeOptions) {
  const mergedOptions = Object.assign({}, defaultTypeOptions, typeOptions);

  const buildActionOptions = (options) => {
    const { adapter } = mergedOptions;
    return adapter ? Object.assign({}, options, { adapter }) : options;
  };

  function all(state) {
    return Object.keys(state.brainstem[brainstemKey])
      .filter(id => mergedOptions.filterPredicate(state.brainstem[brainstemKey][id]))
      .reduce((memo, id) => {
        memo[id] = state.brainstem[brainstemKey][id]; // eslint-disable-line no-param-reassign
        return memo;
      }, {});
  }

  function find(id, models) {
    return models[id];
  }

  function findAll(idList, models) {
    return idList.map(id => find(id, models));
  }

  function findAllInState(idList, state) {
    return findAll(idList, all(state));
  }

  function findInList(id, list) {
    return list.filter(model => model.id === id)[0];
  }

  function findInState(id, state) {
    return find(id, all(state));
  }

  function fetchAll(options) {
    return collectionFetch(brainstemKey, buildActionOptions(options));
  }

  function fetch(id, options) {
    return modelActions.fetch(brainstemKey, id, buildActionOptions(options));
  }

  function save(id, attributes, options) {
    return modelActions.save(brainstemKey, id, attributes, buildActionOptions(options));
  }

  function destroy(id, options) {
    return modelActions.destroy(brainstemKey, id, buildActionOptions(options));
  }

  function matchesAction({ meta, payload }) {
    return (
      isObject(meta) && meta.origin === 'storageManager' &&
      isObject(payload) && payload.brainstemKey === brainstemKey
    );
  }

  function modelAction(type, model) {
    return {
      type,
      meta: { origin: 'storageManager' },
      payload: {
        brainstemKey,
        attributes: model,
      },
    };
  }

  function removeModel(model) {
    return modelAction('REMOVE_MODEL', model);
  }

  function syncModel(model) {
    return modelAction('SYNC_MODEL', model);
  }

  return {
    all,
    destroy,
    find,
    findAll,
    findAllInState,
    findInList,
    findInState,
    fetchAll,
    fetch,
    matchesAction,
    removeModel,
    save,
    syncModel,
  };
}
