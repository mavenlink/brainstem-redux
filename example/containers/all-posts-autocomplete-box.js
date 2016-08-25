const { connect } = require('react-redux')
const PostAutocompleteBox = require('../components/post-autocomplete-box')

const mapStateToProps = (state) => {
  return {
    allPosts: state.postsAutocompleter.posts,
    filterText: state.postsAutocompleter.filterText,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    onInput: (event) => {
      dispatch({
        type: 'POSTS_AUTOCOMPLETER_REQUEST_POSTS',
        search: event.target.value,
      })
      // - [ ] Dispatch an action to:
      //   - [x] update `isFetching` on redux feature store slice
      //   - [ ] *fetch a backbone collection for this specific feature*
      // - The fetch will on success:
      //   - [x] Update the global storage manager -> redux brainstem store slice
      //   - [ ] Update the redux feature store slice with references of the backbone collection models
      //   - [ ] Update `isFetching` to false
    }
  }
}

module.exports = connect(
  mapStateToProps,
  mapDispatchToProps
)(PostAutocompleteBox)
