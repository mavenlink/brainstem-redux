const React = require('react');

export default React.createClass({
  render() {
    return React.DOM.li(null, this.props.message);
  },
});
