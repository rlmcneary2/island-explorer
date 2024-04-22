const path = require("path");
const { composePlugins, withNx } = require("@nx/webpack");
const { merge } = require("webpack-merge");
const BundleAnalyzerPlugin =
  require("webpack-bundle-analyzer").BundleAnalyzerPlugin;

module.exports = composePlugins(withNx(), (config, context) => {
  console.log(
    `---\n--- apps/island-explorer/webpack.config.js mode='${context.configuration}'`
  );

  const customConfig = {
    devServer: {
      historyApiFallback: true,
      host: "0.0.0.0"
    },
    // mode: context.configuration,
    module: {
      rules: [
        {
          test: /\.svg$/,
          use: ["@svgr/webpack"]
        }
      ]
    },
    optimization: {
      splitChunks: {
        cacheGroups: {
          vendorMap: {
            chunks: "all",
            name: "vendor-map",
            test: /[\\/]node_modules[\\/](@turf|mapbox-gl|remapgl)[\\/]/
          }
        }
      }
    },
    resolve: {
      alias: {
        react: path.resolve("node_modules/react"),
        "react-dom": path.resolve("node_modules/react-dom")
      }
    }
  };

  if (
    context.configuration === "production" &&
    config.output?.filename?.endsWith(".esm.js")
  ) {
    customConfig.plugins = [
      new BundleAnalyzerPlugin({
        analyzerMode: "static"
      })
    ];
    console.log("--- Added BundleAnalyzerPlugin.");
  }

  const merged = merge(config, customConfig);

  console.log(`---`);

  return merged;
});
