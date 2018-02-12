const omit = require('lodash.omit'); // eslint-disable-line import/no-extraneous-dependencies
const collectionActions = require('../../lib/actions/collection');
const modelActions = require('../../lib/actions/model');
const makeBrainstemType = require('../../lib/types/make-brainstem-type');

describe('makeBrainstemType', () => {
  const brainstemKey = 'KEY';
  const type = makeBrainstemType(brainstemKey);

  describe('looking up models', () => {
    const model1 = { id: '5' };
    const model2 = { id: '11' };
    const model3 = { id: '42' };
    const models = {
      [model1.id]: model1,
      [model2.id]: model2,
      [model3.id]: model3,
    };
    const state = {
      brainstem: { [brainstemKey]: models },
    };

    describe('looking up all models in the state', () => {
      it('returns all models in the state tree', () => {
        expect(type.all(state)).toEqual(models);
      });
    });

    describe('looking up all models in the state that return true for a filterPredicate passed into options', () => {
      it('returns all models in the state tree', () => {
        const typeWithDefaultScope = makeBrainstemType(brainstemKey, {
          filterPredicate: model => model.id === '5',
        });
        expect(typeWithDefaultScope.all(state)).toEqual({ [model1.id]: model1 });
      });
    });

    describe('finding a model by id', () => {
      describe('when the model is present', () => {
        const id = model2.id;

        it('returns the model', () => {
          expect(type.find(id, models)).toEqual(model2);
        });
      });

      describe('when the model is not present', () => {
        const id = 'MISSING';

        it('returns undefined', () => {
          expect(type.find(id, models)).toBeUndefined();
        });
      });
    });

    describe('finding a model by id in the state', () => {
      const id = model3.id;

      it('returns the model', () => {
        expect(type.findInState(id, state)).toEqual(model3);
      });

      it('does not call .all', () => {
        spyOn(type, 'all').and.callThrough();
        type.findInState(id, state);
        expect(type.all).not.toHaveBeenCalled();
      });
    });

    describe('finding a model by id in a list', () => {
      const modelList = [model1, model2, model3];

      describe('when the model is present', () => {
        const id = model2.id;

        it('returns the model', () => {
          expect(type.findInList(id, modelList)).toEqual(model2);
        });
      });

      describe('when the model is not present', () => {
        const id = 'MISSING';

        it('returns undefined', () => {
          expect(type.findInList(id, modelList)).toBeUndefined();
        });
      });
    });

    describe('finding a list of models by id', () => {
      describe('when all models are present', () => {
        const idList = [model3.id, model1.id];

        it('returns all found models in the order specified', () => {
          expect(type.findAll(idList, models)).toEqual([model3, model1]);
        });
      });

      describe('when some models are missing', () => {
        const idList = ['MISSING', model2.id];

        it('returns undefined for missing models', () => {
          expect(type.findAll(idList, models)).toEqual([undefined, model2]);
        });
      });
    });

    describe('finding a list of models by id in the state', () => {
      const idList = [model2.id, model3.id];

      it('returns all found models in the order specified', () => {
        expect(type.findAllInState(idList, state)).toEqual([model2, model3]);
      });
    });
  });

  describe('fetching a collection of models', () => {
    beforeEach(() => {
      spyOn(collectionActions, 'fetch').and.returnValue('RESULT');
    });

    it('forwards the request to brainstem-redux', () => {
      const options = { stuff: 'options' };
      expect(type.fetchAll(options)).toEqual('RESULT');
      expect(collectionActions.fetch).toHaveBeenCalledWith(brainstemKey, options);
    });

    describe('passing in adapter', () => {
      it('appends the adapter to the options', () => {
        const typeWithAdapter = makeBrainstemType(brainstemKey, {
          adapter: 'adapter',
        });

        expect(typeWithAdapter.fetchAll({ foo: 'test' })).toEqual('RESULT');
        expect(collectionActions.fetch).toHaveBeenCalledWith(brainstemKey, { foo: 'test', adapter: 'adapter' });
      });
    });
  });

  describe('fetching a model by id', () => {
    beforeEach(() => {
      spyOn(modelActions, 'fetch').and.returnValue('RESULT');
    });

    it('forwards the request to brainstem-redux', () => {
      const id = '2';
      const options = 'OPTIONS';
      expect(type.fetch(id, options)).toEqual('RESULT');
      expect(modelActions.fetch).toHaveBeenCalledWith(brainstemKey, id, options);
    });

    describe('passing in adapter', () => {
      it('appends the adapter to the options', () => {
        const typeWithAdapter = makeBrainstemType(brainstemKey, {
          adapter: 'adapter',
        });

        expect(typeWithAdapter.fetch(1, { foo: 'test' })).toEqual('RESULT');
        expect(modelActions.fetch).toHaveBeenCalledWith(brainstemKey, 1, { foo: 'test', adapter: 'adapter' });
      });
    });
  });

  describe('saving a model', () => {
    beforeEach(() => {
      spyOn(modelActions, 'save').and.returnValue('RESULT');
    });

    it('forwards the request to brainstem-redux', () => {
      const id = '2';
      const attributes = 'ATTRIBUTES';
      const options = 'OPTIONS';
      expect(type.save(id, attributes, options)).toEqual('RESULT');
      expect(modelActions.save).toHaveBeenCalledWith(brainstemKey, id, attributes, options);
    });

    describe('passing in adapter', () => {
      it('appends the adapter to the options', () => {
        const typeWithAdapter = makeBrainstemType(brainstemKey, {
          adapter: 'adapter',
        });

        expect(typeWithAdapter.save(1, {}, { foo: 'test' })).toEqual('RESULT');
        expect(modelActions.save).toHaveBeenCalledWith(brainstemKey, 1, {}, { foo: 'test', adapter: 'adapter' });
      });
    });
  });

  describe('deleting a model', () => {
    beforeEach(() => {
      spyOn(modelActions, 'destroy').and.returnValue('RESULT');
    });

    it('forwards the request to brainstem-redux', () => {
      const id = '2';
      const options = 'OPTIONS';
      expect(type.destroy(id, options)).toEqual('RESULT');
      expect(modelActions.destroy).toHaveBeenCalledWith(brainstemKey, id, options);
    });

    describe('passing in adapter', () => {
      it('appends the adapter to the options', () => {
        const typeWithAdapter = makeBrainstemType(brainstemKey, {
          adapter: 'adapter',
        });

        expect(typeWithAdapter.destroy(1, { foo: 'test' })).toEqual('RESULT');
        expect(modelActions.destroy).toHaveBeenCalledWith(brainstemKey, 1, { foo: 'test', adapter: 'adapter' });
      });
    });
  });

  describe('matching actions from brainstem-redux', () => {
    const modelAction = type.syncModel({ id: '1' });

    function itDoesNotMatch(action) {
      expect(type.matchesAction(action)).toEqual(false);
    }

    describe('when the origin and key match', () => {
      const action = modelAction;

      it('matches', () => {
        expect(type.matchesAction(action)).toEqual(true);
      });
    });

    describe('when the origin is not the brainstem storage manager', () => {
      const action = Object.assign(
        {},
        modelAction,
        { meta: { origin: 'OTHER' } },
      );

      it('does not match', () => {
        itDoesNotMatch(action);
      });
    });

    describe('when the origin is missing', () => {
      const action = omit(modelAction, 'meta');

      it('does not match', () => {
        itDoesNotMatch(action);
      });
    });

    describe('when the action is for a different model', () => {
      const action = Object.assign(
        {},
        modelAction,
        { payload: { brainstemKey: 'OTHER_KEY' } },
      );

      it('does not match', () => {
        itDoesNotMatch(action);
      });
    });

    describe('when there is no brainstem key', () => {
      const action = Object.assign(
        {},
        modelAction,
        { payload: {} },
      );

      it('does not match', () => {
        itDoesNotMatch(action);
      });
    });

    describe('when there is no payload', () => {
      const action = omit(modelAction, 'payload');

      it('does not match', () => {
        itDoesNotMatch(action);
      });
    });
  });
});
