const React = require('react');
const PostFilterInput = require('./post-filter-input').default;
const PostList = require('./post-list').default;

export default React.createClass({
  visiblePosts() {
    return this.props.allPosts.filter((post) => post.message.indexOf(this.props.filterText) >= 0);
  },

  render() {
    return React.DOM.div(null,
      React.DOM.h1(null, 'Autocomplete Posts'),
      React.createElement(PostFilterInput, {
        handleInput: this.props.onInput,
        filterText: this.props.filterText,
      }),
      React.createElement(PostList, { posts: this.visiblePosts() })
    );
  },
});
