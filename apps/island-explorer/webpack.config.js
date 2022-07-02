const { merge } = require("webpack-merge");

module.exports = (config, context) => {
  console.log(`---\n--- apps/island-explorer/webpack.config.js\n---`);

  // The cache.addAll requests don't include an Accept header that the dev
  // server likes so allow any mime type.
  if (config.devServer) {
    config.devServer.historyApiFallback.htmlAcceptHeaders = ["*/*"];
  }

  return merge(config, {
    module: {
      rules: [
        {
          test: /\.svg$/,
          use: ["@svgr/webpack"]
        }
      ]
    }
  });
};
