const path = require("path");
const { merge } = require("webpack-merge");

module.exports = (config, context) => {
  console.log(`---\n--- apps/island-explorer/webpack.config.js\n---`);

  return merge(config, {
    devServer: {
      historyApiFallback: true
    },
    module: {
      rules: [
        {
          test: /\.svg$/,
          use: ["@svgr/webpack"]
        }
      ]
    },
    resolve: {
      alias: {
        react: path.resolve("node_modules/react"),
        "react-dom": path.resolve("node_modules/react-dom")
      }
    }
  });
};
