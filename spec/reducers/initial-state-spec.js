describe('initializing the store', () => {
  it('sets up the store with a brainstem key', () => {
    expect(Object.keys(store.getState())).toContain('brainstem')
  });

  it('populates brainstem state slice with empty collections', () => {
    expect(Object.keys(store.getState().brainstem)).toContain('posts')
    expect(Object.keys(store.getState().brainstem)).toContain('users')

    expect(store.getState().brainstem.posts).toEqual({})
    expect(store.getState().brainstem.users).toEqual({})
  });
});
