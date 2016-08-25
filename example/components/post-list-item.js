const React = require('react')

module.exports = React.createClass({
  render: function() {
    return React.DOM.li(null, this.props.message)
  }
})
