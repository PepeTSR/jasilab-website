# jasilab.net

Marketing and documentation site for JasiLab and CVT. Deployed to Cloudflare Pages from GitHub.

- **This site:** `jasilab.net` — research, products, CVT docs at `/cvt`
- **CVT app (live registry):** `cvt.jasilab.net` — separate repo (`workspace-cvt`)

## Local preview (dev server)

```bash
cd jasilab-website
npm install
npm run sync:docs   # optional — refresh specs from ../workspace-cvt/docs
npm run dev
```

Open **http://localhost:4321**

| Page | URL |
|------|-----|
| JasiLab home | http://localhost:4321/ |
| CVT landing | http://localhost:4321/cvt |
| CVT vision | http://localhost:4321/cvt/vision |
| CVT documents | http://localhost:4321/cvt/docs |
| Trust Profile spec | http://localhost:4321/cvt/docs/trust-profile |

Production-like preview after build:

```bash
npm run build
npm run preview
```

## Sync product docs

When specs change in the CVT app repo:

```bash
npm run sync:docs
```

## Cloudflare Pages

Settings are in [`wrangler.toml`](./wrangler.toml) and [`cloudflare-pages.md`](./cloudflare-pages.md).

| Setting | Value |
|---------|-------|
| Build command | `npm run build` |
| Output directory | `dist` |
| Node.js | 22 (`.node-version`) |
| Production branch | `main` |

Docs in `src/content/cvt/docs/` are **committed to this repo**. After updating specs in the CVT app repo, run `npm run sync:docs` locally and commit the changes — Cloudflare CI does not have access to `workspace-cvt`.

### Connect GitHub

1. Push to GitHub: `git remote add origin git@github.com:<org>/jasilab-website.git && git push -u origin main`
2. Cloudflare Dashboard → **Workers & Pages** → **Create** → **Pages** → **Connect to Git**
3. Select the repo and confirm build settings match the table above
4. Add custom domain **jasilab.net**
