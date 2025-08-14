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
  plugins: [
    monkey({
      entry: "@/notion/main.ts",
      build: {
        fileName: "notion.user.js",
      },
      userscript: {
        name: "Notion Enhance",
        icon: "https://www.notion.so/images/favicon.ico",
        namespace: "npm/vite-plugin-monkey",
        match: ["https://www.notion.so/*"],
      },
    }),
  ],
});
