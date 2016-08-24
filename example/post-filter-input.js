const React = require('react')

module.exports = React.createClass({
  handleInput (event) {
    console.log(event)
  },

  render () {
    return React.DOM.input({ onInput: this.handleInput })
  },
})
