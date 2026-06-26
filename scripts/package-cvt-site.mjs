#!/usr/bin/env node
/**
 * Package dist/cvt/ as a standalone site at dist-cvt/ for cvt.co.ug.
 * Run after: PUBLIC_CVT_BASE= PUBLIC_SITE_URL=https://cvt.co.ug npm run build
 */
import { cpSync, existsSync, mkdirSync, readdirSync, readFileSync, rmSync, statSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const dist = join(root, "dist");
const out = join(root, "dist-cvt");
const cvtSrc = join(dist, "cvt");

if (!existsSync(cvtSrc)) {
  console.error("Missing dist/cvt — run npm run build first");
  process.exit(1);
}

rmSync(out, { recursive: true, force: true });
mkdirSync(out, { recursive: true });

cpSync(cvtSrc, out, { recursive: true });

for (const item of ["_astro", "favicon.svg", "_headers"]) {
  const src = join(dist, item);
  if (existsSync(src)) {
    cpSync(src, join(out, item), { recursive: true });
  }
}

function rewriteHtml(html) {
  return html
    .replace(/href="\/cvt\//g, 'href="/')
    .replace(/href="\/cvt"/g, 'href="/"')
    .replace(/href="\/cvt#/g, 'href="/#')
    .replace(/content="https:\/\/jasilab\.net\/cvt/g, 'content="https://cvt.co.ug')
    .replace(/https:\/\/jasilab\.net\/cvt/g, "https://cvt.co.ug");
}

function walk(dir) {
  for (const name of readdirSync(dir)) {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) walk(path);
    else if (name.endsWith(".html")) {
      writeFileSync(path, rewriteHtml(readFileSync(path, "utf8")));
    }
  }
}

walk(out);
console.log("Packaged CVT site → dist-cvt/");
