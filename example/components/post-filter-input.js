const React = require('react');

export default React.createClass({
  render() {
    return React.DOM.input({
      onChange: this.props.handleInput,
      value: this.props.filterText,
    });
  },
});
