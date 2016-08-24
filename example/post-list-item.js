const React = require('react')
const ReactDom = require('react-dom')

module.exports = React.createClass({
  render: function() {
    return React.DOM.li(null, this.props.message, '!')
  }
})
