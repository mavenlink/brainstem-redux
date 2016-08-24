const React = require('react')
const PostFilterInput = require('./post-filter-input')
const PostList = require('./post-list')

module.exports = React.createClass({
  render: function() {
    return React.DOM.div(null,
      React.DOM.h1(null, 'Autocomplete Posts'),
      React.createElement(PostFilterInput),
      React.createElement(PostList, this.props)
    )
  }
})
