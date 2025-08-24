const { merge } = require('webpack-merge');
const common = require('./webpack.common.cjs');
const { InjectManifest } = require('workbox-webpack-plugin');

module.exports = merge(common, {
  mode: 'production',
  plugins: [
    new InjectManifest({
      swSrc: './src/sw.js',
      swDest: 'sw.js',
    }),
  ],
});
