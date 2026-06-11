# jasilab.net

Marketing site for JasiLab and CVT. Deployed to Cloudflare Workers from GitHub.

- **This site:** `jasilab.net` — research, products, CVT story at `/cvt`
- **CVT app (live registry):** `cvt.jasilab.net` — separate repo (`workspace-cvt`)

## Local preview (dev server)

```bash
cd jasilab-website
npm install
npm run dev
```

Open **http://localhost:4321**

| Page | URL |
|------|-----|
| JasiLab home | http://localhost:4321/ |
| CVT landing | http://localhost:4321/cvt |
| CVT vision | http://localhost:4321/cvt/vision |
| CVT concepts | http://localhost:4321/cvt/concepts |
| CVT guides | http://localhost:4321/cvt/guides |

Production-like preview after build:

```bash
npm run build
npm run preview
```

## Cloudflare Workers

Settings are in [`wrangler.toml`](./wrangler.toml).

| Setting | Value |
|---------|-------|
| Build command | `npm run build` |
| Deploy command | `npx wrangler deploy` |
| Node.js | 22 (`.node-version`) |
| Production branch | `main` |

Technical specifications live in the CVT product repo (`workspace-cvt/docs`) and are shared with partners under agreement — not published on this marketing site.
