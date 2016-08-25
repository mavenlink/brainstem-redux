const { connect } = require('react-redux')
const PostAutocompleteBox = require('../components/post-autocomplete-box')

const mapStateToProps = (state) => {
  return { allPosts: Object.keys(state.brainstem.posts).map(key => state.brainstem.posts[key]) }
}

module.exports = connect(
  mapStateToProps
)(PostAutocompleteBox)
