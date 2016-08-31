const webpackConfig = Object.assign(require('./webpack.config'), {
  entry: {},
});

module.exports = (config) =>
  config.set({
    browsers: ['PhantomJS'],

    frameworks: ['jasmine'],

    files: [
      'spec/**/*.js',
    ],

    preprocessors: {
      'spec/**/*': ['webpack'],
    },

    webpack: webpackConfig,

    webpackMiddleware: {
      noInfo: true
    },
  });
