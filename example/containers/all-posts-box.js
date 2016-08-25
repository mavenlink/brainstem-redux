const { connect } = require('react-redux')
const PostBox = require('../components/post-box')

const mapStateToProps = (state) => {
  return { posts: Object.keys(state.brainstem.posts).map(key => state.brainstem.posts[key]) }
}

module.exports = connect(
  mapStateToProps
)(PostBox)
