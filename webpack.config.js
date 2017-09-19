module.exports = {
  entry: './api.js',

  externals: {
    'brainstem-js': 'brainstem-js',
    jquery: 'jquery',
  },

  module: {
    loaders: [{
      exclude: /(node_modules)/,
      loader: 'babel-loader',
      query: {
        presets: ['es2015'],
        plugins: [
          ['transform-object-rest-spread', { useBuiltIns: true }],
        ],
      },
    }],
  },
};
