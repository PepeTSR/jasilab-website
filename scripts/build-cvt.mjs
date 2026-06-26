#!/usr/bin/env node
/**
 * Build cvt.co.ug with a selectable theme.
 * Usage: node scripts/build-cvt.mjs [default|superhuman|tesla]
 */
import { spawnSync } from "node:child_process";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const themeArg = process.argv[2] ?? "default";
const validThemes = ["default", "superhuman", "tesla"];

if (!validThemes.includes(themeArg)) {
  console.error(`Unknown theme "${themeArg}". Use: default, superhuman, or tesla`);
  process.exit(1);
}

const theme = themeArg === "default" ? "" : themeArg;

const env = {
  ...process.env,
  PUBLIC_CVT_BASE: "",
  PUBLIC_SITE_URL: "https://cvt.co.ug",
  NODE_ENV: "production",
};
if (theme) env.PUBLIC_CVT_THEME = theme;

const label = theme || "default";
console.log(`Building cvt.co.ug (theme: ${label})…`);

const build = spawnSync("npx", ["astro", "build"], { cwd: root, env, stdio: "inherit" });
if (build.status !== 0) process.exit(build.status ?? 1);

const pack = spawnSync("node", ["scripts/package-cvt-site.mjs", label], {
  cwd: root,
  env,
  stdio: "inherit",
});
process.exit(pack.status ?? 0);
