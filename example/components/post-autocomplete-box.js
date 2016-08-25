const React = require('react')
const PostFilterInput = require('./post-filter-input')
const PostList = require('./post-list')

module.exports = React.createClass({
  getInitialState: function() {
    return { filterText: this.props.filterText || '' }
  },

  handleInput (event) {
    this.setState({ filterText: event.target.value })
  },

  visiblePosts () {
    return this.props.allPosts.filter(post => post.message.indexOf(this.state.filterText) >= 0)
  },

  render: function() {
    return React.DOM.div(null,
      React.DOM.h1(null, 'Autocomplete Posts'),
      React.createElement(PostFilterInput, {
        handleInput: this.handleInput,
        filterText: this.state.filterText
      }),
      React.createElement(PostList, { posts: this.visiblePosts() })
    )
  },
})
