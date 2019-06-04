module.exports = {
  module: {
    rules: [{
      test: /\.js$/,
      exclude: /node_modules/,
      use: {
        loader: 'babel-loader',
        options: {
          presets: [
            [
              '@babel/preset-env',
              {
                corejs: '2.6.9',
                debug: true,
                targets: [
                  'IE 11',
                  'last 5 Chrome versions',
                  'last 5 Edge versions',
                  'last 5 Firefox versions',
                  'last 5 Opera versions',
                  'last 5 Safari versions',
                ],
                useBuiltIns: 'usage',
              },
            ],
          ],
        },
      },
    }],
  },
};
