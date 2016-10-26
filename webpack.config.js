const Path = require('path')

module.exports = {
  entry: './api.js',

  module: {
    loaders: [ {
      exclude: /(node_modules)/,
      loader: 'babel-loader',
      query: {
        presets: ['es2015'],
        plugins: ['transform-runtime'],
      },
    }],
  },

  output: {
    path: './bin',
    filename: 'index.js',
  },

  resolve: {
    alias: {
      example: Path.resolve('./', 'example'),
      lib: Path.resolve('./', 'lib'),
    }
  }
}
