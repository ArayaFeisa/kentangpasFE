const { merge } = require("webpack-merge");
const common = require("./webpack.common.cjs");
const webpack = require("webpack");
const { GenerateSW } = require("workbox-webpack-plugin");

module.exports = merge(common, {
  mode: "production",
  plugins: [
    new webpack.DefinePlugin({
      "process.env.NODE_ENV": JSON.stringify("production"),
    }),
    new GenerateSW({
      swDest: "service-worker.js",
      clientsClaim: true,
      skipWaiting: true,

      additionalManifestEntries: [
        { url: "/offline.html", revision: "3" },
        { url: "/index.html", revision: "3" },
      ],

      navigateFallback: "/offline.html",
      navigateFallbackDenylist: [/^\/api\//],

      runtimeCaching: [
        {
          urlPattern: ({ url }) => url.origin === "https://apikentangpas.cloud",
          handler: "NetworkFirst",
          options: {
            cacheName: "api-kentangpas",
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
    }),
  ],
});
