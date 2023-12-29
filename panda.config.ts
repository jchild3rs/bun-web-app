import { defineConfig, defineGlobalStyles } from "@pandacss/dev";

const globalCss = defineGlobalStyles({
  "html, body": {
    color: "gray.900",
    lineHeight: "1.5",
    _dark: {
      color: "white",
      bg: "gray.900",
    },
  },
});

export default defineConfig({
  globalCss,
  preflight: true,
  minify: process.env.NODE_ENV === "production",
  include: ["./src/**/*.view.ts", "./src/**/*.html"],
  exclude: [],
  outdir: "dist/static/styled-system",
  theme: {
    extend: {
      semanticTokens: {},
    },
  },
});
