const { merge } = require('webpack-merge');
const common = require('./webpack.common.cjs');
const Dotenv = require('dotenv-webpack');

module.exports = merge(common, {
  mode: 'development',
  devtool: 'inline-source-map',
  devServer: {
    static: './dist',
    hot: true,
    port: 3000,
    open: true,
  },
  plugins: [
    new Dotenv({
      path: './.env.development',
      safe: false,
      systemvars: true,
    }),
  ],
});
