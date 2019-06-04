const { connect } = require('react-redux');
const PostAutocompleteBox = require('../components/post-autocomplete-box').default;

const { fetch: fetchCollection } = require('../../lib/actions/collection').default;
const actionCreators = require('../actions/posts-autocompleter');

const mapStateToProps = (state) => {
  return {
    allPosts: state.postsAutocompleter.posts.map((post_id) => {
      return state.brainstem.posts[post_id];
    }),
    filterText: state.postsAutocompleter.filterText,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onInput: (event) => {
      dispatch(
        fetchCollection('posts', {
          fetchOptions: { search: event.target.value },
          preFetchAction: actionCreators.posts.preFetch(event.target.value),
          postFetchAction: actionCreators.posts.postFetch,
          trackKey: 'all-posts-autocomplete-box',
        })
      );
    },
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PostAutocompleteBox);
