import { defineConfig } from "vite";
import { resolve } from "node:path";
import monkey from "vite-plugin-monkey";
import { userscripts, type UserscriptId } from "./config/userscripts";

const SRC_ROOT = resolve(import.meta.dirname ?? ".", "..");

export function createUserscriptConfig(id: UserscriptId) {
  const { entry, outFile, meta } = userscripts[id];

  return defineConfig({
    resolve: {
      alias: { "@": resolve(SRC_ROOT, "src") },
    },
    build: {
      outDir: resolve(SRC_ROOT, `dist/${id}`),
      emptyOutDir: true,
    },
    plugins: [
      monkey({
        entry,
        build: { fileName: outFile },
        userscript: meta,
      }),
    ],
  });
}
