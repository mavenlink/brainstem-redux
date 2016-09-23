const Path = require('path')

module.exports = {
  entry: './index.js',

  output: {
    path: './bin',
    filename: 'index.js',
  },

  resolve: {
    alias: {
      example: Path.resolve('./', 'example')
    }
  }
}
