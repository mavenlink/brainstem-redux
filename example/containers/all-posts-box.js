const { connect } = require('react-redux');
const PostBox = require('../components/post-box').default;

const mapStateToProps = (state) => {
  return { posts: Object.keys(state.brainstem.posts).map(key => state.brainstem.posts[key]) };
};

export default connect(
  mapStateToProps
)(PostBox);
