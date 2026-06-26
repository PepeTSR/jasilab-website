// @ts-check
import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";

const siteUrl = process.env.PUBLIC_SITE_URL ?? "https://jasilab.net";

// https://astro.build/config
export default defineConfig({
  site: siteUrl,
  vite: {
    plugins: [tailwindcss()],
    envPrefix: ["PUBLIC_"],
  },
});
