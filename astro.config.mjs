// @ts-check
import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";

const siteUrl = process.env.PUBLIC_SITE_URL ?? "https://jasilab.net";
const isCvtRootBuild = process.env.PUBLIC_CVT_BASE === "";
const isDev = process.env.NODE_ENV !== "production";

// https://astro.build/config
export default defineConfig({
  site: siteUrl,
  // Dev 404s on /cvt/platform without slash; production cvt.co.ug prefers trailing slashes
  trailingSlash: isCvtRootBuild && !isDev ? "always" : "ignore",
  vite: {
    plugins: [tailwindcss()],
    envPrefix: ["PUBLIC_"],
  },
});
