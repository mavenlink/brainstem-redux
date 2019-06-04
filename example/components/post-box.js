const React = require('react');
const PostList = require('./post-list').default;

export default React.createClass({
  render() {
    return React.DOM.div(null,
      React.DOM.h1(null, 'Posts'),
      React.createElement(PostList, this.props)
    );
  },
});
