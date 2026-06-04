#!/usr/bin/env node
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const sourceRoot = join(root, "..", "workspace-cvt", "docs");
const targetRoot = join(root, "src", "content", "cvt", "docs");

const DOCS = [
  { slug: "vision", source: "CVT_VISION.md", title: "CVT Vision", description: "Registry, Trust Profile, and Connect — platform north star.", version: "2026-06", order: 1 },
  { slug: "trust-profile", source: "TRUST_PROFILE.md", title: "Trust Profile", description: "Trust Timeline, trust level, moderation, and partner tiers.", version: "v1", order: 2 },
  { slug: "trust-architecture-v1", source: "TRUST_ARCHITECTURE_V1.md", title: "Trust Architecture v1", description: "Facts, policy engine, access tiers, and partner search.", version: "v1", order: 3 },
  { slug: "registry-categories", source: "REGISTRY_CATEGORIES.md", title: "Registry Categories", description: "Multi-category registry IDs and verification categories.", version: "draft", order: 4 },
];

function rewriteLinks(body) {
  return body
    .replace(/\]\(\.\/TRUST_PROFILE\.md\)/g, "](/cvt/docs/trust-profile)")
    .replace(/\]\(\.\/CVT_VISION\.md\)/g, "](/cvt/docs/vision)")
    .replace(/\]\(\.\/TRUST_ARCHITECTURE_V1\.md\)/g, "](/cvt/docs/trust-architecture-v1)")
    .replace(/\]\(\.\/REGISTRY_CATEGORIES\.md\)/g, "](/cvt/docs/registry-categories)")
    .replace(/\]\(\.\/PRODUCT_SPEC\.md\)/g, "](/cvt/docs/vision)")
    .replace(/\]\(\.\.\/CVT Hail\/docs\/[^)]+\)/g, "](/cvt)");
}

async function main() {
  await mkdir(targetRoot, { recursive: true });
  for (const doc of DOCS) {
    const sourcePath = join(sourceRoot, doc.source);
    let body;
    try {
      body = await readFile(sourcePath, "utf8");
    } catch {
      console.warn(`skip (missing): ${doc.source}`);
      continue;
    }
    if (body.startsWith("---")) body = body.replace(/^---[\s\S]*?---\n/, "");
    body = rewriteLinks(body);
    const frontmatter = `---\ntitle: ${JSON.stringify(doc.title)}\ndescription: ${JSON.stringify(doc.description)}\nversion: ${JSON.stringify(doc.version)}\norder: ${doc.order}\n---\n\n`;
    await writeFile(join(targetRoot, `${doc.slug}.md`), frontmatter + body, "utf8");
    console.log(`synced ${doc.source}`);
  }
}

main().catch((err) => { console.error(err); process.exit(1); });
