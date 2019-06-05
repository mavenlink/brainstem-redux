const webpackConfig = require('./webpack.config');

module.exports = config => (
  config.set({
    browsers: ['Chrome', 'PhantomJS', 'Firefox'],

    frameworks: ['jasmine'],

    files: [
      'spec/actions/*.js',
      'spec/adapters/*.js',
      'spec/reducers/*.js',
      'spec/middleware/*.js',
      'spec/sync/*.js',
      'spec/types/*.js',
      'spec/api-spec.js',
    ],

    preprocessors: {
      'spec/**/*': ['webpack', 'sourcemap'],
    },

    webpack: webpackConfig,

    webpackMiddleware: {
      noInfo: true,
    },
  })
);
