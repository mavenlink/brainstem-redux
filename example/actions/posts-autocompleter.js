module.exports = {
  posts: {
    preFetch: filterText => {
      return {
        type: 'POSTS_AUTOCOMPLETER_REQUEST_POSTS',
        filterText: filterText,
      };
    },

    postFetch: postIds => {
      return {
        type: 'POSTS_AUTOCOMPLETER_SYNC_POSTS',
        posts: postIds,
      };
    },
  }
};
