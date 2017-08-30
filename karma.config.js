const webpackConfig = require('./webpack.config');


const karmaWebpackLoadersOverrides = [
  {
    query: {
      presets: ['es2015'],
      plugins: [
        'transform-runtime',
        ['transform-object-rest-spread', { useBuiltIns: true }],
      ],
    },
  },
];
const karmaWebpackLoaders = webpackConfig.module.loaders
  .map((loader, i) => Object.assign({}, loader, karmaWebpackLoadersOverrides[i]));
const karmaWebpackConfig = Object.assign({}, webpackConfig, {
  devtool: 'inline-source-map',
  entry: {},
  externals: {},
  module: {
    loaders: karmaWebpackLoaders,
  },
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

    webpack: karmaWebpackConfig,

    webpackMiddleware: {
      noInfo: true,
    },
  });
