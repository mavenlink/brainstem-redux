const webpackConfig = require('./webpack.config');

module.exports = config => (
  config.set({
    browsers: ['Chrome', 'PhantomJS', 'Firefox'],

    frameworks: ['jasmine'],

    files: [
      'spec/**/*-spec.js',
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
