const webpackConfig = Object.assign(require('./webpack.config'), {
  entry: {},
  devtool: 'inline-source-map',
});

module.exports = (config) =>
  config.set({
    browsers: ['Chrome'],

    frameworks: ['jasmine'],

    files: [
      'spec/actions/*.js',
      'spec/reducers/*.js',
      'spec/middleware/*.js',
      'spec/sync/*.js',
      'spec/index-spec.js',
    ],

    preprocessors: {
      'spec/**/*': ['webpack', 'sourcemap'],
    },

    webpack: webpackConfig,

    webpackMiddleware: {
      noInfo: true
    },
  });
