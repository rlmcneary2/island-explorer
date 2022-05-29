module.exports = config => {
  console.log(`---\n--- apps/island-explorer/webpack.config.js\n---`);

  // The cache.addAll requests don't include an Accept header that the dev
  // server likes so allow any mime type.
  config.devServer.historyApiFallback.htmlAcceptHeaders = ["*/*"];

  return config;
};
