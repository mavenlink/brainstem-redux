export let posts = {
  preFetch(filterText) {
    return {
      type: 'POSTS_AUTOCOMPLETER_REQUEST_POSTS',
      payload: { filterText },
    };
  },

  postFetch(postIds) {
    return {
      type: 'POSTS_AUTOCOMPLETER_SYNC_POSTS',
      payload: { posts: postIds },
    };
  },
};
