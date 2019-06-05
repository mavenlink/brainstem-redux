import beforeEachHelpers from '../helpers/before-each';
import stopUpdateStore from '../../lib/sync/stop-update-store';

describe('stopping listening to events from  storageManager', () => {
  beforeEach(function () {
    beforeEachHelpers.call(this);
    this.posts = this.storageManager.storage('posts');
  });

  it('stops listening for add events and does not update the store', function () {
    stopUpdateStore(this.store);

    this.posts.add({ id: 1, title: 'What is redux?', message: 'I do not know but it might be awesome' });

    expect(this.store.getState().brainstem.posts[1]).toBeUndefined();
  });

  it('stops listening for change events and does not update the store', function () {
    this.posts.add({ id: 1, title: 'What is redux?', message: 'I do not know but it might be awesome' });

    stopUpdateStore(this.store);

    this.posts.last().set({ title: 'This is redux!', message: 'Now I know it is awesome' });

    expect(this.store.getState().brainstem.posts[1].title).toEqual('What is redux?');
    expect(this.store.getState().brainstem.posts[1].message).toEqual('I do not know but it might be awesome');
  });

  it('stops listening for remove events and does not update the store', function () {
    this.posts.add({ id: 1, title: 'What is redux?', message: 'I do not know but it might be awesome' });
    const post = this.posts.last().toJSON();

    stopUpdateStore(this.store);

    this.posts.remove({
      id: 1,
      title: 'What is redux?',
      message: 'I do not know but it might be awesome',
    });

    expect(this.store.getState().brainstem.posts[1]).toEqual(post);
  });
});
