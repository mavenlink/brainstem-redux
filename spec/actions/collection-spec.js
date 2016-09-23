describe('collection action creators', function() {
  require('../helpers/before-each');

  beforeEach(function() {
    this.fetch = require('../../lib/actions/collection').fetch;
    this.storageManager.enableExpectations();
  });

  it('fetches the collection', function() {
    const expectation = this.storageManager.stub('posts', { filters: { foo: 'bar' } });
    this.store.dispatch(this.fetch('posts', {
      fetchOptions: { filters: { foo: 'bar' } }
    }));

    expect(expectation.requestQueue.length).toBe(1);
  });

  describe('previous XHRs', function() {
    it('uses a trackKey to abort previous pending XHR', function() {
      const abort = jasmine.createSpy('abort');
      const state = () => 'pending';
      spyOn(this.storageManager.storage('posts'), 'fetch').and.returnValue({ abort, state });
      this.store.dispatch(this.fetch('posts', { trackKey: 'foo' }));
      this.store.dispatch(this.fetch('posts', { trackKey: 'foo' }));

      expect(abort).toHaveBeenCalledTimes(1);
    });

    it('does not abort non-pending previous XHR', function() {
      const abort = jasmine.createSpy('abort');
      const state = () => 'resolved';
      spyOn(this.storageManager.storage('posts'), 'fetch').and.returnValue({ abort, state });
      this.store.dispatch(this.fetch('posts', { trackKey: 'foo' }));
      this.store.dispatch(this.fetch('posts', { trackKey: 'foo' }));

      expect(abort).toHaveBeenCalledTimes(0);
    });
  });
});
