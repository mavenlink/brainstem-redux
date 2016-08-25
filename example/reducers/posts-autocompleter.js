const initialState = {
  posts: [],
  filterText: '',
  isFetching: false,
};

module.exports = (state = initialState, action) => {
  if (action.type == 'POSTS_AUTOCOMPLETER_REQUEST_POSTS') {
    return Object.assign({}, state, {
      filterText: action.search,
      isFetching: true
    });
  } else {
    return state;
  }
};
