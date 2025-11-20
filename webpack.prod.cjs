const { merge } = require("webpack-merge");
const common = require("./webpack.common.cjs");
const webpack = require("webpack");
const { GenerateSW } = require("workbox-webpack-plugin");
const Dotenv = require("dotenv-webpack");

module.exports = merge(common, {
  mode: "production",
  plugins: [
    new Dotenv({
      path: "./.env.production",
      safe: false,
      systemvars: true,
    }),
    new webpack.DefinePlugin({
      "process.env.NODE_ENV": JSON.stringify("production"),
    }),
    new GenerateSW({
      swDest: "service-worker.js",
      clientsClaim: true,
      skipWaiting: true,

      navigateFallback: "/index.html",
      navigateFallbackDenylist: [/^\/api\//],

      runtimeCaching: [
        {
          urlPattern: ({ url }) => url.origin === "http://api-bibitku.filkom.ub.ac.id",
          handler: "NetworkFirst",
          options: {
            cacheName: "api-bibitku",
            networkTimeoutSeconds: 12,
            expiration: { maxEntries: 50, maxAgeSeconds: 3600 },
            cacheableResponse: { statuses: [0, 200] },
          },
        },
        {
          urlPattern: ({ url }) =>
            url.origin.includes("fonts.gstatic.com") ||
            url.origin.includes("fonts.googleapis.com"),
          handler: "StaleWhileRevalidate",
          options: { cacheName: "fonts" },
        },
      ],
      cleanupOutdatedCaches: true,
      sourcemap: false,
    }),
  ],
});
