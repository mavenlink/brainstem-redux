const initialState = {
  posts: [],
  filterText: '',
  isFetching: false,
};

module.exports = (state = initialState, action) => {
  switch (action.type) {
    case 'POSTS_AUTOCOMPLETER_REQUEST_POSTS':
      return Object.assign({}, state, {
        filterText: action.filterText,
        isFetching: true,
      });
    case 'POSTS_AUTOCOMPLETER_SYNC_POSTS':
      return Object.assign({}, state, {
        isFetching: false,
        posts: action.posts,
      });
    default:
      return state;
  }
};
