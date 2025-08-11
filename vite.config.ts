import { defineConfig } from "vite";
import monkey from "vite-plugin-monkey";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    monkey({
      entry: "src/main.ts",
      userscript: {
        name: "Notion Enhance",
        icon: "https://www.notion.so/images/favicon.ico",
        namespace: "npm/vite-plugin-monkey",
        match: ["https://www.notion.so/*"],
      },
    }),
  ],
});
