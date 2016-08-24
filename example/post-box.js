const React = require('react')
const PostList = require('./post-list')

module.exports = React.createClass({
  render: function() {
    return React.DOM.div(null,
      React.DOM.h1(null, 'Posts'),
      React.createElement(PostList, this.props)
    )
  }
})
