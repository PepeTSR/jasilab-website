// @ts-check
import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";

const siteUrl = process.env.PUBLIC_SITE_URL ?? "https://jasilab.net";
const isCvtRootBuild = process.env.PUBLIC_CVT_BASE === "";

// https://astro.build/config
export default defineConfig({
  site: siteUrl,
  trailingSlash: isCvtRootBuild ? "always" : "ignore",
  vite: {
    plugins: [tailwindcss()],
    envPrefix: ["PUBLIC_"],
  },
});
