import $ from 'jquery';
import beforeEachHelpers from '../helpers/before-each';
import { fetch as collectionFetch } from '../../lib/actions/collection';
import Post from '../../example/models/post';

describe('collection action creators', () => {
  beforeEach(function () {
    beforeEachHelpers.call(this);
    this.fetch = collectionFetch;
    this.storageManager.enableExpectations();
  });

  describe('default adapter', () => {
    it('fetches the collection', function () {
      const expectation = this.storageManager.stub('posts', { filters: { foo: 'bar' } });
      this.store.dispatch(this.fetch('posts', {
        fetchOptions: { filters: { foo: 'bar' } },
      }));

      expect(expectation.requestQueue.length).toBe(1);
    });

    describe('promise interface', () => {
      it('exists', function () {
        this.storageManager.stub('posts');
        expect(this.store.dispatch(this.fetch('posts'))).toEqual(jasmine.any(Promise));
      });

      it('resolves with an object when jqXHR is done', function (done) {
        const postsModels = [new Post({ id: 1, title: 'Bar' }), new Post({ id: 2, title: 'Foo' })];
        const expectation = this.storageManager.stub('posts', {
          response(responseBody) {
            responseBody.results = postsModels; // eslint-disable-line no-param-reassign
          },
        });
        this.store.dispatch(this.fetch('posts')).then((response) => {
          expect(response).toEqual({
            count: 2,
            currentPage: 1,
            results: postsModels.map((model) => model.attributes),
            totalPages: 1,
          });
          done();
        });
        expectation.respond();
      });

      it('rejects when jqXHR fails', function (done) {
        const deferred = $.Deferred(); // eslint-disable-line new-cap
        spyOn(this.storageManager.storage('posts'), 'fetch').and.returnValue(deferred);
        this.store.dispatch(this.fetch('posts')).catch(done);
        deferred.reject();
      });
    });

    describe('previous XHRs', () => {
      it('uses a trackKey to abort previous pending XHR', function () {
        const abort = jasmine.createSpy('abort');
        const state = () => 'pending';
        spyOn(this.storageManager.storage('posts'), 'fetch').and.returnValue({ abort, state });
        this.store.dispatch(this.fetch('posts', { trackKey: 'foo' })).catch(() => {});
        this.store.dispatch(this.fetch('posts', { trackKey: 'foo' })).catch(() => {});

        expect(abort).toHaveBeenCalledTimes(1);
      });

      it('does not abort non-pending previous XHR', function () {
        const abort = jasmine.createSpy('abort');
        const state = () => 'resolved';
        spyOn(this.storageManager.storage('posts'), 'fetch').and.returnValue({ abort, state });
        this.store.dispatch(this.fetch('posts', { trackKey: 'foo' })).catch(() => {});
        this.store.dispatch(this.fetch('posts', { trackKey: 'foo' })).catch(() => {});

        expect(abort).toHaveBeenCalledTimes(0);
      });
    });
  });

  describe('when an adapter is passed in', () => {
    it('uses the adapter', function () {
      const deferred = $.Deferred(); // eslint-disable-line new-cap
      const stubAdapter = {
        fetchCollection: jasmine.createSpy('fetchCollection').and.returnValue(deferred),
      };
      const fetchOptions = { filters: { foo: 'bar' } };
      this.store.dispatch(this.fetch('posts', {
        fetchOptions,
        adapter: stubAdapter,
      }));

      expect(stubAdapter.fetchCollection).toHaveBeenCalledWith('posts', {
        dispatch: jasmine.any(Function),
        getState: jasmine.any(Function),
        fetchOptions,
      });
    });
  });
});
