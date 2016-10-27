const webpackConfig = Object.assign(require('./webpack.config'), {
  devtool: 'inline-source-map',
  entry: {},
  output: {},
});

module.exports = config =>
  config.set({
    browsers: ['Chrome', 'PhantomJS', 'Firefox'],

    frameworks: ['jasmine'],

    files: [
      'spec/actions/*.js',
      'spec/reducers/*.js',
      'spec/middleware/*.js',
      'spec/sync/*.js',
      'spec/api-spec.js',
    ],

    preprocessors: {
      'spec/**/*': ['webpack', 'sourcemap'],
    },

    webpack: webpackConfig,

    webpackMiddleware: {
      noInfo: true,
    },
  });
