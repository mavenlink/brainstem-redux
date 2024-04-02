const initialState = {
  posts: [],
  filterText: '',
  isFetching: false,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case 'POSTS_AUTOCOMPLETER_REQUEST_POSTS':
      return {
        ...state,
        filterText: action.payload.filterText,
        isFetching: true,
      };
    case 'POSTS_AUTOCOMPLETER_SYNC_POSTS':
      return {
        ...state,
        isFetching: false,
        posts: action.payload.posts,
      };
    default:
      return state;
  }
};
