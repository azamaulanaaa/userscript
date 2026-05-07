import { defineConfig } from "vite";
import { dirname, fromFileUrl, resolve } from "@std/path";
import monkey from "vite-plugin-monkey";

const __dirname = dirname(fromFileUrl(import.meta.url));

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      "@": resolve(__dirname, "../"),
    },
  },
  build: {
    outDir: "dist/joss",
  },
  plugins: [
    monkey({
      entry: "src/joss/main.ts",
      build: {
        fileName: "joss.user.js",
      },
      userscript: {
        name: "Joss Jatim",
        icon: "https://joss.jatimprov.go.id/images/logo.png",
        namespace: "npm/vite-plugin-monkey",
        match: ["https://joss.jatimprov.go.id/*"],
      },
    }),
  ],
});
