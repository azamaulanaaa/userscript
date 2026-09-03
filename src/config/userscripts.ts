export interface UserscriptMeta {
  name: string;
  icon: string;
  namespace: string;
  match: string[];
  description?: string;
  version?: string;
  author?: string;
  grant?: string[];
}

export const userscripts = {
  joss: {
    entry: "src/joss/main.ts",
    outFile: "joss.user.js",
    meta: {
      name: "Joss Jatim",
      icon: "https://joss.jatimprov.go.id/images/logo.png",
      namespace: "npm/vite-plugin-monkey",
      match: ["https://joss.jatimprov.go.id/*"],
      description: "Auto POST redirect for JOSS Jatim e-tracker",
    } satisfies UserscriptMeta,
  },
  dpmptsp: {
    entry: "src/dpmptsp/main.ts",
    outFile: "dpmptsp.user.js",
    meta: {
      name: "DPMPTSP Helpdesk Prefill",
      icon: "https://dpmptsp.jatimprov.go.id/helpdesk/web/favicon.ico",
      namespace: "npm/vite-plugin-monkey",
      match: ["https://dpmptsp.jatimprov.go.id/helpdesk/web/index.php/helpdesk/new/*"],
      description: "Prefill helpdesk form (no_registrasi, nib, judul, deskripsi) from URL query params — no auto-submit",
    } satisfies UserscriptMeta,
  },
} as const;

export type UserscriptId = keyof typeof userscripts;
