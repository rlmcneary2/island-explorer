var terser = require("@rollup/plugin-terser");

module.exports = function (cfg) {
  cfg.output[0].chunkFileNames = "[name].js";
  cfg.output[0].entryFileNames = "[name].js";
  cfg.output[0].sourcemap = true;

  if (process.env.NODE_ENV === "production") {
    cfg.plugins.push(terser());
  }

  return cfg;
};
