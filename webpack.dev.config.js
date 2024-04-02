const webpackConfig = require('./webpack.config.js'); // eslint-disable-line

module.exports = {
  ...webpackConfig,
  entry: './example/index.js',

  output: {
    filename: 'example-bundle.js',
  },
};
