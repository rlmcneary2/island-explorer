/// <reference types='vitest' />
import fs from "fs";
import path from "path";
import {
  type UserConfig,
  defineConfig,
  splitVendorChunkPlugin,
  type PluginOption
} from "vite";
import react from "@vitejs/plugin-react";
import { nxViteTsPaths } from "@nx/vite/plugins/nx-tsconfig-paths.plugin";
import svgr from "vite-plugin-svgr";
import { viteStaticCopy } from "vite-plugin-static-copy";
import { visualizer } from "rollup-plugin-visualizer";

export default defineConfig(cfg => {
  const { command, mode } = cfg;
  console.log(`--- VITE CONFIG --- command='${command}', mode='${mode}'`);

  const config: UserConfig = {
    cacheDir: "../../node_modules/.vite/apps/island-explorer",
    plugins: [
      viteStaticCopy({
        targets: [
          {
            dest: "./",
            src: "../../dist/libs/service-worker/service-worker.js"
          },
          {
            dest: "./",
            src: "../../dist/libs/service-worker/service-worker.js.map"
          }
        ]
      }),
      svgr(),
      react(),
      splitVendorChunkPlugin(),
      nxViteTsPaths()
    ],
    resolve: {
      alias: {
        lodash: "lodash-es"
      }
    },
    root: __dirname,

    build: {
      commonjsOptions: {
        transformMixedEsModules: true
      },
      outDir: "../../dist/apps/island-explorer",
      reportCompressedSize: true,
      rollupOptions: {
        output: {
          assetFileNames: "assets/[name][extname]",
          chunkFileNames: "[name].js",
          entryFileNames: "index.js",
          manualChunks(id) {
            if (id.includes("mapbox-gl")) {
              return "mapbox-gl";
            } else if (id.includes("core-js") || id.includes("lodash")) {
              return "vendor";
            }
          }
        }
      }
    },

    preview: {
      host: "localhost",
      https: {
        cert: fs.readFileSync(
          path.resolve(path.join(__dirname, "../../cert/localhost.crt"))
        ),
        key: fs.readFileSync(
          path.resolve(path.join(__dirname, "../../cert/localhost.key"))
        )
      },
      port: 4200,
      proxy: {
        "/api": {
          changeOrigin: true,
          secure: false,
          target: "https://island-explorer-bus-server.netlify.app"
        }
      }
    },

    server: {
      host: "localhost",
      https: {
        cert: fs.readFileSync(
          path.resolve(path.join(__dirname, "../../cert/localhost.crt"))
        ),
        key: fs.readFileSync(
          path.resolve(path.join(__dirname, "../../cert/localhost.key"))
        )
      },
      port: 4200
    },

    test: {
      globals: true,
      cache: {
        dir: "../../node_modules/.vitest"
      },
      environment: "jsdom",
      include: ["src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"],

      reporters: ["default"],
      coverage: {
        reportsDirectory: "../../coverage/apps/island-explorer",
        provider: "v8"
      }
    }
  };

  if (mode === "production") {
    config.plugins?.push(
      visualizer({
        filename: "../../stats/stats.html"
        // template: "network"
      }) as PluginOption
    );
  }

  return config;
});
