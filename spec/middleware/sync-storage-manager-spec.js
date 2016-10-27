const beforeEachHelpers = require('../helpers/before-each');

describe('sync-brainstem middleware', () => {
  beforeEach(function () {
    beforeEachHelpers.call(this);
    this.posts = this.storageManager.storage('posts');
    this.store.dispatch({
      type: 'ADD_MODEL',
      payload: {
        brainstemKey: 'posts',
        attributes: {
          id: 76,
          title: 'Hello',
          message: 'World!',
        },
      },
    });
  });

  it('adds new model to storageManager', function () {
    expect(this.posts.last().toJSON()).toEqual(this.store.getState().brainstem.posts[76]);
  });

  it('changes existing attributes on a model in the storageManager', function () {
    this.store.dispatch({
      type: 'CHANGE_MODEL',
      payload: {
        brainstemKey: 'posts',
        attributes: {
          id: 76,
          title: 'Goodbye',
          message: 'Cruel World!',
        },
      },
    });

    expect(this.posts.last().toJSON()).toEqual(this.store.getState().brainstem.posts[76]);
  });

  it('removes a model from the storageManager', function () {
    this.store.dispatch({
      type: 'REMOVE_MODEL',
      payload: {
        brainstemKey: 'posts',
        attributes: { id: 76 },
      },
    });

    expect(this.posts.get(76)).not.toBeDefined();
  });
});
