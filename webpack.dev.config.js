const webpackConfig = require('./webpack.config.js');

module.exports = Object.assign({}, webpackConfig, {
  entry: './example/index.js',

  output: {
    filename: 'example-bundle.js',
  },
});
