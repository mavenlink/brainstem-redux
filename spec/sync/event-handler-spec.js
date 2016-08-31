describe('handling events from storageManager', function() {
  beforeEach(function() {
    posts = this.storageManager.storage('posts');
    posts.add({ id: 1, title: 'What is redux?', message: 'I do not know but it might be awesome' });
  });

  it('listens for an add event and syncs the store', function() {
    expect(this.store.getState().brainstem.posts[1]).toEqual(posts.last().toJSON());
  });

  it('listens for change and updates the store', function() {
    posts.last().set({ id: 1, title: 'This is redux!', message: 'Now I know it is awesome' });

    expect(this.store.getState().brainstem.posts[1]).toEqual(posts.last().toJSON());
  });

  it('listens for an remove event and syncs the store', function() {
    posts.remove({ id: 1, title: 'What is redux?', message: 'I do not know but it might be awesome' });

    expect(this.store.getState().brainstem.posts).toEqual({})
  });
});
