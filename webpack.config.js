module.exports = {
  entry: './api.js',

  module: {
    loaders: [{
      exclude: /(node_modules)/,
      loader: 'babel-loader',
      query: {
        presets: ['es2015'],
        plugins: ['transform-runtime'],
      },
    }],
  },

  output: {
    filename: 'index.js',
    libraryTarget: 'commonjs2',
    path: './bin',
  },
};
