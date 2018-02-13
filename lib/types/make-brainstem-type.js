const isObject = require('lodash.isobject');
const collectionActions = require('../actions/collection');
const modelActions = require('../actions/model');

const defaultTypeOptions = {
  filterPredicate: () => true,
};

module.exports = function makeBrainstemType(brainstemKey, typeOptions = defaultTypeOptions) {
  const mergedOptions = Object.assign({}, defaultTypeOptions, typeOptions);

  const buildActionOptions = (options) => {
    const { adapter } = mergedOptions;
    return adapter ? Object.assign({}, options, { adapter }) : options;
  };

  const typeFunctions = {
    all(state) {
      return Object.keys(state.brainstem[brainstemKey])
        .filter(id => mergedOptions.filterPredicate(state.brainstem[brainstemKey][id]))
        .reduce((memo, id) => {
          memo[id] = state.brainstem[brainstemKey][id]; // eslint-disable-line no-param-reassign
          return memo;
        }, {});
    },

    find(id, models) {
      return models[id];
    },

    findAll(idList, models) {
      return idList.map(id => typeFunctions.find(id, models));
    },

    findAllInState(idList, state) {
      return typeFunctions.findAll(idList, typeFunctions.all(state));
    },

    findInList(id, list) {
      return list.filter(model => model.id === id)[0];
    },

    findInState(id, state) {
      const models = mergedOptions.filterPredicate() !== true ? typeFunctions.all(state) : state.brainstem[brainstemKey]
      return typeFunctions.find(id, models);
    },

    fetchAll(options) {
      return collectionActions.fetch(brainstemKey, buildActionOptions(options));
    },

    fetch(id, options) {
      return modelActions.fetch(brainstemKey, id, buildActionOptions(options));
    },

    save(id, attributes, options) {
      return modelActions.save(brainstemKey, id, attributes, buildActionOptions(options));
    },

    destroy(id, options) {
      return modelActions.destroy(brainstemKey, id, buildActionOptions(options));
    },

    matchesAction({ meta, payload }) {
      return (
        isObject(meta) && meta.origin === 'storageManager' &&
        isObject(payload) && payload.brainstemKey === brainstemKey
      );
    },

    modelAction(type, model) {
      return {
        type,
        meta: { origin: 'storageManager' },
        payload: {
          brainstemKey,
          attributes: model,
        },
      };
    },

    removeModel(model) {
      return typeFunctions.modelAction('REMOVE_MODEL', model);
    },

    syncModel(model) {
      return typeFunctions.modelAction('SYNC_MODEL', model);
    },
  };

  return typeFunctions;
};
