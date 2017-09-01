const lodashFind = require('lodash.find');
const isObject = require('lodash.isobject');
const pickBy = require('lodash.pickby');
const collectionActions = require('../actions/collection');
const modelActions = require('../actions/model');

module.exports = function makeBrainstemType(brainstemKey, filter = () => true) {
  function all(state) {
    return pickBy(state.brainstem[brainstemKey], filter);
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
    return lodashFind(list, model => model.id === id);
  }

  function findInState(id, state) {
    return find(id, all(state));
  }

  function fetchAll(options) {
    return collectionActions.fetch(brainstemKey, options);
  }

  function fetch(id, options) {
    return modelActions.fetch(brainstemKey, id, options);
  }

  function save(id, attributes, options) {
    return modelActions.save(brainstemKey, id, attributes, options);
  }

  function destroy(id, options) {
    return modelActions.destroy(brainstemKey, id, options);
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
