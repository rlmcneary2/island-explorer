/// <reference types='vitest' />
import fs from "fs";
import path from "path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { nxViteTsPaths } from "@nx/vite/plugins/nx-tsconfig-paths.plugin";
import svgr from "vite-plugin-svgr";

export default defineConfig({
  root: __dirname,
  cacheDir: "../../node_modules/.vite/apps/island-explorer",

  server: {
    port: 4200,
    host: "localhost",
    https: {
      cert: fs.readFileSync(
        path.resolve(path.join(__dirname, "../../cert/localhost.crt"))
      ),
      key: fs.readFileSync(
        path.resolve(path.join(__dirname, "../../cert/localhost.key"))
      )
    }
  },

  preview: {
    port: 4300,
    host: "localhost"
  },

  plugins: [svgr(), react(), nxViteTsPaths()],

  // Uncomment this if you are using workers.
  // worker: {
  //  plugins: [ nxViteTsPaths() ],
  // },

  build: {
    outDir: "../../dist/apps/island-explorer",
    reportCompressedSize: true,
    commonjsOptions: {
      transformMixedEsModules: true
    }
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
});
