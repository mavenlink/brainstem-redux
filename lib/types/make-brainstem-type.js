const isObject = require('lodash.isobject');
const collectionActions = require('../actions/collection');
const modelActions = require('../actions/model');

const defaultTypeOptions = {
  filterPredicate: () => true,
};

module.exports = function makeBrainstemType(brainstemKey, typeOptions = defaultTypeOptions) {
  const mergedOptions = { ...defaultTypeOptions, ...typeOptions };

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
    const optionsWithAdapter = mergedOptions.adapter ? {
      ...options,
      adapter: mergedOptions.adapter,
    } : options;
    return collectionActions.fetch(brainstemKey, optionsWithAdapter);
  }

  function fetch(id, options) {
    const optionsWithAdapter = mergedOptions.adapter ? {
      ...options,
      adapter: mergedOptions.adapter,
    } : options;
    return modelActions.fetch(brainstemKey, id, optionsWithAdapter);
  }

  function save(id, attributes, options) {
    const optionsWithAdapter = mergedOptions.adapter ? {
      ...options,
      adapter: mergedOptions.adapter,
    } : options;
    return modelActions.save(brainstemKey, id, attributes, optionsWithAdapter);
  }

  function destroy(id, options) {
    const optionsWithAdapter = mergedOptions.adapter ? {
      ...options,
      adapter: mergedOptions.adapter,
    } : options;
    return modelActions.destroy(brainstemKey, id, optionsWithAdapter);
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
};
