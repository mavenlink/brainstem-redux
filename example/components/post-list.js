const React = require('react');
const PostListItem = require('./post-list-item');

module.exports = React.createClass({
  getDefaultProps() {
    return { posts: [] };
  },

  render() {
    return React.DOM.ul(null,
      this.props.posts.map(post => (
        React.createElement(PostListItem, Object.assign({}, post, { key: post.id }))
      ))
    );
  },
});
