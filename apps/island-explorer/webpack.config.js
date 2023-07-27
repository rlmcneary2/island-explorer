const path = require("path");
const { merge } = require("webpack-merge");
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

module.exports = (config, context) => {
  console.log(`---\n--- apps/island-explorer/webpack.config.js`);

  const customConfig = {
    devServer: {
      historyApiFallback: true,
      host: "0.0.0.0"
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
  };

  if (context.configuration === "production" && config.output.filename.endsWith(".esm.js")) {
    customConfig.plugins = [new BundleAnalyzerPlugin()];
    console.log("--- Added BundleAnalyzerPlugin.");
  }

  console.log(`---`);

  return merge(config, customConfig);
};
