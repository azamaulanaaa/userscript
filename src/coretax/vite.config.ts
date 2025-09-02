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
    outDir: "dist/coretax",
  },
  plugins: [
    monkey({
      entry: "src/coretax/main.ts",
      build: {
        fileName: "coretax.user.js",
      },
      userscript: {
        name: "Coretax Enhance",
        namespace: "npm/vite-plugin-monkey",
        match: ["https://coretaxdjp.pajak.go.id/*"],
      },
    }),
  ],
});
