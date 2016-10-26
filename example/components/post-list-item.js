const React = require('react');

module.exports = React.createClass({
  render() {
    return React.DOM.li(null, this.props.message);
  },
});
