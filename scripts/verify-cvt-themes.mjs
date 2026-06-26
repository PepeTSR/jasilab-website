#!/usr/bin/env node
/**
 * Verify all three cvt.co.ug theme builds.
 */
import { spawnSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const themes = ["default", "superhuman", "tesla"];

for (const theme of themes) {
  console.log(`\n=== build:cvt:${theme === "default" ? "" : theme} ===`);
  const r = spawnSync("node", ["scripts/build-cvt.mjs", theme], { cwd: root, stdio: "inherit" });
  if (r.status !== 0) process.exit(r.status ?? 1);

  const out = join(root, "dist-cvt");
  const label = readFileSync(join(out, ".cvt-build-theme"), "utf8").trim();
  const index = readFileSync(join(out, "index.html"), "utf8");

  if (label !== theme) {
    console.error(`Theme marker mismatch: expected ${theme}, got ${label}`);
    process.exit(1);
  }
  if (!existsSync(join(out, "hero-puzzle-connect.png"))) {
    console.error("Missing hero-puzzle-connect.png in dist-cvt");
    process.exit(1);
  }
  if (index.includes('src="/cvt/')) {
    console.error("Unrewritten /cvt/ asset paths in index.html");
    process.exit(1);
  }
  if ((theme === "superhuman" || theme === "tesla") && !index.includes("Get verified")) {
    console.error(`${theme} index missing Get verified CTA`);
    process.exit(1);
  }
  if (theme === "default" && !index.includes("Get verified")) {
    console.error("default index missing Get verified CTA");
    process.exit(1);
  }
  if (theme === "superhuman" && !index.includes("sh-scroll")) {
    console.error("superhuman index missing scroll hero");
    process.exit(1);
  }
  if (theme === "tesla" && !index.includes("tesla-hero")) {
    console.error("tesla index missing tesla hero");
    process.exit(1);
  }
  console.log(`OK ${theme}`);
}

console.log("\nAll theme builds passed.");
