const beforeEachHelpers = require('../helpers/before-each');

describe('initializing the store', () => {
  beforeEach(function () {
    beforeEachHelpers.call(this);
  });

  it('sets up the store with a brainstem key', function () {
    expect(Object.keys(this.store.getState())).toContain('brainstem');
  });

  it('populates brainstem state slice with empty collections', function () {
    expect(Object.keys(this.store.getState().brainstem)).toContain('posts');
    expect(Object.keys(this.store.getState().brainstem)).toContain('users');

    expect(this.store.getState().brainstem.posts).toEqual({});
    expect(this.store.getState().brainstem.users).toEqual({});
  });
});
