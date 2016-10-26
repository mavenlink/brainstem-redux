const Path = require('path')

module.exports = {
  entry: './api.js',

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
