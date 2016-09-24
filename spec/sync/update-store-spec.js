describe('handling events from storageManager', function() {
  require('../helpers/before-each');

  beforeEach(function() {
    this.posts = this.storageManager.storage('posts');
    this.posts.add({ id: 1, title: 'What is redux?', message: 'I do not know but it might be awesome' });
  });

  it('listens for an add event and syncs the store', function() {
    expect(this.store.getState().brainstem.posts[1]).toEqual(this.posts.last().toJSON());
  });

  it('listens for change and updates the store', function() {
    this.posts.last().set({ title: 'This is redux!', message: 'Now I know it is awesome' });

    expect(this.store.getState().brainstem.posts[1].title).toEqual('This is redux!');
  });

  it('listens for an remove event and syncs the store', function() {
    this.posts.remove({ id: 1, title: 'What is redux?', message: 'I do not know but it might be awesome' });

    expect(this.store.getState().brainstem.posts).toEqual({})
  });
});
