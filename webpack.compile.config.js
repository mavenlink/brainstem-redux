const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin; // eslint-disable-line import/no-extraneous-dependencies
const path = require('path');
const webpackConfig = require('./webpack.config.js');

module.exports = Object.assign({}, webpackConfig, {
  entry: './api.js',

  externals: {
    'brainstem-js': 'brainstem-js',
    jquery: 'jquery',
  },

  output: {
    filename: 'index.js',
    libraryTarget: 'commonjs2',
    path: path.join(__dirname, 'bin'),
  },

  plugins: [
    new BundleAnalyzerPlugin({
      analyzerMode: 'static',
      openAnalyzer: false,
    }),
  ],
});
