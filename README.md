# jasilab.net + cvt.co.ug

Marketing sites for JasiLab and CVT. Deployed to Cloudflare Workers from GitHub.

| Site | Domain | Worker | Build |
|------|--------|--------|-------|
| JasiLab | [jasilab.net](https://jasilab.net) | `jasilab-website` | `npm run build` |
| CVT public | [cvt.co.ug](https://cvt.co.ug) | `cvt-website` | `npm run build:cvt` |

The live CVT registry app is at **https://cvt.ug** (`workspace-cvt` repo).

## Local preview

```bash
cd jasilab-website
npm install
npm run dev          # jasilab.net — http://localhost:4321
npm run dev:cvt      # cvt.co.ug paths — http://localhost:4322 (pages still under /cvt in dev)
```

| Page | JasiLab URL | Production CVT URL |
|------|-------------|-------------------|
| JasiLab home | http://localhost:4321/ | https://jasilab.net/ |
| CVT landing | http://localhost:4321/cvt | https://cvt.co.ug/ |
| CVT vision | http://localhost:4321/cvt/vision | https://cvt.co.ug/vision |

Production-like CVT preview:

```bash
npm run preview:cvt
```

## Deploy

### GitHub Actions (recommended)

Pushes to `main` run two workflows:

| Workflow | Worker | Command |
|----------|--------|---------|
| `Deploy cvt.co.ug` | `cvt-website` | `npm run build:cvt` → `wrangler.cvt.toml` |
| `Deploy jasilab.net` | `jasilab-website` | `npm run build` → `wrangler.toml` |

**One-time setup** — add [repository secrets](https://github.com/PepeTSR/jasilab-website/settings/secrets/actions):

| Secret | Where to get it |
|--------|-----------------|
| `CLOUDFLARE_API_TOKEN` | Cloudflare Dashboard → My Profile → API Tokens → Create Token → **Edit Cloudflare Workers** template |
| `CLOUDFLARE_ACCOUNT_ID` | Cloudflare Dashboard → Workers & Pages → right sidebar on Overview |

Manual deploy: GitHub → **Actions** → pick workflow → **Run workflow**.

**Important:** attach **cvt.co.ug** only to the `cvt-website` worker (not `jasilab-website`). See `docs/CVT_CO_UG.md`.

### Cloudflare Dashboard (alternative)

**jasilab.net** (`jasilab-website`):

- Build: `npm run build`
- Deploy: `npx wrangler deploy`
- Serves JasiLab at `/` and CVT at `/cvt` — no redirect to cvt.co.ug

**cvt.co.ug** (`cvt-website`):

- Build: `npm run build:cvt`
- Deploy: `npx wrangler deploy --config wrangler.cvt.toml`
- Add custom domain **cvt.co.ug** on the `cvt-website` worker only

## Technical specifications

Detailed specs live in `workspace-cvt/docs/` and are shared with partners under agreement — not published on either marketing site.
