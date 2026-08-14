#!/usr/bin/env node
/**
 * Fail wrangler deploy if dist-cvt is missing or contains JasiLab homepage.
 * Wired from wrangler.cvt.toml via: node scripts/verify-cvt-worker-assets.mjs
 */
import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const indexPath = join(root, "dist-cvt", "index.html");

if (!existsSync(indexPath)) {
  console.error("verify-cvt-worker-assets: dist-cvt/index.html missing — run npm run build:cvt first");
  process.exit(1);
}

const html = readFileSync(indexPath, "utf8");

if (!html.includes("CVT - Trust") && !html.includes("CVT — Trust")) {
  console.error("verify-cvt-worker-assets: dist-cvt is not the CVT marketing homepage");
  process.exit(1);
}

if (/JasiLab — Research|Research · Products|products\/hay|products\/carehome/i.test(html)) {
  console.error(
    "verify-cvt-worker-assets: dist-cvt looks like JasiLab dist/ — use wrangler.cvt.toml not wrangler.toml",
  );
  process.exit(1);
}

const themeFile = join(root, "dist-cvt", ".cvt-build-theme");
const theme = existsSync(themeFile) ? readFileSync(themeFile, "utf8").trim() : "";

if (theme !== "superhuman") {
  console.error(
    `verify-cvt-worker-assets: expected superhuman theme for cvt.co.ug (got "${theme || "unknown"}") — run npm run build:cvt:superhuman`,
  );
  process.exit(1);
}

if (!html.includes("theme-superhuman") || !html.includes("sh-scroll")) {
  console.error(
    "verify-cvt-worker-assets: dist-cvt is the legacy default CVT skin (jasilab.net/cvt style), not the cvt.co.ug superhuman homepage",
  );
  process.exit(1);
}

console.log("verify-cvt-worker-assets: dist-cvt OK for cvt-website worker (superhuman)");
