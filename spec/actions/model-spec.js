describe('model action creators', function() {
  require('../helpers/before-each');

  beforeEach(function() {
    this.storageManager.enableExpectations();
  });

  describe('fetch', function() {
    beforeEach(function() {
      this.fetch = require('../../lib/actions/model').fetch;
    });

    it('fetches the model', function() {
      const expectation = this.storageManager.stubModel('posts', '76', { filters: { foo: 'baz' } });
      this.store.dispatch(this.fetch('posts', '76', {
        fetchOptions: { filters: { foo: 'baz' } }
      }));

      expect(expectation.requestQueue.length).toBe(1);
    });

    describe('previous XHRs', function() {
      it('uses a trackKey to abort previous pending XHR', function() {
        const abort = jasmine.createSpy('abort');
        const state = () => 'pending';
        spyOn(this.storageManager.storage('posts').model.prototype, 'fetch').and.returnValue({ abort, state });
        this.store.dispatch(this.fetch('posts', '76', { trackKey: 'foo' }));
        this.store.dispatch(this.fetch('posts', '76', { trackKey: 'foo' }));

        expect(abort).toHaveBeenCalledTimes(1)
      });

      it('does not abort non-pending previous XHR', function() {
        const abort = jasmine.createSpy('abort');
        const state = () => 'resolved';
        spyOn(this.storageManager.storage('posts').model.prototype, 'fetch').and.returnValue({ abort, state });
        this.store.dispatch(this.fetch('posts', '76', { trackKey: 'foo' }));
        this.store.dispatch(this.fetch('posts', '76', { trackKey: 'foo' }));

        expect(abort).toHaveBeenCalledTimes(0)
      });
    });
  });

  describe('save', function() {
    beforeEach(function() {
      this.save = require('../../lib/actions/model').save;
    });

    it('send save to the subscriber for the existing model', function() {
      const posts = this.storageManager.storage('posts');
      posts.add({ id: 1, title: 'What is redux?', message: 'I do not know but it might be awesome' });
      const model = posts.last();

      const spy = spyOn(model, 'save');

      this.store.dispatch(this.save('posts', '1', {
        title: 'new post'
      }))

      expect(spy).toHaveBeenCalled()
    });

    it('subscriber saves a non-persisted model', function() {
      const save = jasmine.createSpy('save')
      const ModelSpy = spyOn(this.storageManager.storage('posts'), 'model');
      ModelSpy.and.returnValue({ save });

      this.store.dispatch(this.save('posts', undefined, {
        title: 'new post'
      }))

      expect(ModelSpy).toHaveBeenCalledWith({ id: undefined });
      expect(save).toHaveBeenCalled()
    });
  });
});
