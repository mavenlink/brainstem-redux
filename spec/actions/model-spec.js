const beforeEachHelpers = require('../helpers/before-each');
const modelActions = require('../../lib/actions/model');
const $ = require('jquery');

describe('model action creators', () => {
  beforeEach(function () {
    beforeEachHelpers.call(this);
    this.storageManager.enableExpectations();
  });

  describe('fetch', () => {
    beforeEach(function () {
      this.fetch = modelActions.fetch;
    });

    it('fetches the model', function () {
      const expectation = this.storageManager.stubModel('posts', '76', { filters: { foo: 'baz' } });
      this.store.dispatch(this.fetch('posts', '76', {
        fetchOptions: { filters: { foo: 'baz' } },
      }));

      expect(expectation.requestQueue.length).toBe(1);
    });

    describe('previous XHRs', () => {
      it('uses a trackKey to abort previous pending XHR', function () {
        const abort = jasmine.createSpy('abort');
        const state = () => 'pending';
        spyOn(this.storageManager.storage('posts').model.prototype, 'fetch').and.returnValue({ abort, state });
        this.store.dispatch(this.fetch('posts', '76', { trackKey: 'foo' }));
        this.store.dispatch(this.fetch('posts', '76', { trackKey: 'foo' }));

        expect(abort).toHaveBeenCalledTimes(1);
      });

      it('does not abort non-pending previous XHR', function () {
        const abort = jasmine.createSpy('abort');
        const state = () => 'resolved';
        spyOn(this.storageManager.storage('posts').model.prototype, 'fetch').and.returnValue({ abort, state });
        this.store.dispatch(this.fetch('posts', '76', { trackKey: 'foo' }));
        this.store.dispatch(this.fetch('posts', '76', { trackKey: 'foo' }));

        expect(abort).toHaveBeenCalledTimes(0);
      });
    });
  });

  describe('save', () => {
    beforeEach(function () {
      this.save = modelActions.save;
    });

    it('send save to the subscriber for the existing model', function () {
      const posts = this.storageManager.storage('posts');
      posts.add({ id: 1, title: 'What is redux?', message: 'I do not know but it might be awesome' });
      const model = posts.last();

      const spy = spyOn(model, 'save').and.returnValue($.Deferred()); // eslint-disable-line new-cap

      this.store.dispatch(this.save('posts', '1', {
        title: 'new post',
      }));

      expect(spy).toHaveBeenCalled();
    });

    it('subscriber saves a non-persisted model', function () {
      const save = jasmine.createSpy('save').and.returnValue($.Deferred()); // eslint-disable-line new-cap
      const ModelSpy = spyOn(this.storageManager.storage('posts'), 'model');
      ModelSpy.and.returnValue({ save });

      this.store.dispatch(this.save('posts', undefined, {
        title: 'new post',
      }));

      expect(ModelSpy).toHaveBeenCalledWith({ id: undefined });
      expect(save).toHaveBeenCalled();
    });

    it('returns a deferred when the model is invalid', () => {
      spyOn($, 'ajax').and.returnValue($.Deferred()); // eslint-disable-line new-cap

      const attributes = {};
      expect(modelActions.validate('posts', attributes)()).toEqual({ errors: 'needs a user' });

      const dispatch = modelActions.save('posts', null, attributes, { trackKey: 'john-bonham' });
      const xhr = dispatch();

      expect(xhr.resolve).toBeUndefined();
      expect(xhr.reject).toBeUndefined();
      expect(xhr.done).toEqual(jasmine.any(Function));
      expect(xhr.fail).toEqual(jasmine.any(Function));
    });
  });

  describe('destroy', () => {
    beforeEach(function () {
      this.destroy = modelActions.destroy;
    });

    it('sends destroy to the subscriber for the existing model', function () {
      const posts = this.storageManager.storage('posts');
      posts.add({ id: 1, title: 'What is redux?', message: 'I do not know but it might be awesome' });
      const model = posts.last();
      this.spy = spyOn(model, 'destroy').and.returnValue($.Deferred()); // eslint-disable-line new-cap
      this.store.dispatch(this.destroy('posts', '1'));

      expect(this.spy).toHaveBeenCalled();
    });

    it('cancels previous requests with the same provided track key if they are pending', function () {
      const xhrResultDouble = {
        abort: jasmine.createSpy('abort'),
        state: () => 'pending',
      };
      spyOn(this.storageManager.storage('posts').model.prototype, 'destroy').and.returnValue(xhrResultDouble);

      this.store.dispatch(this.destroy('posts', '1', { trackKey: 'post-destroy' }));
      this.store.dispatch(this.destroy('posts', '1', { trackKey: 'post-destroy' }));
      expect(xhrResultDouble.abort).toHaveBeenCalledTimes(1)
    })
  });
});
