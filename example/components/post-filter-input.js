const React = require('react')

module.exports = React.createClass({
  render () {
    return React.DOM.input({
      onChange: this.props.handleInput,
      value: this.props.filterText
    })
  },
})
