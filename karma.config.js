const webpackConfig = Object.assign(require('./webpack.config'), {
  entry: {},
});

module.exports = (config) =>
  config.set({
    browsers: ['Chrome'],

    frameworks: ['jasmine'],

    files: [
      'spec/helpers/**/*.js',
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
