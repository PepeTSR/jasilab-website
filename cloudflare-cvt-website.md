# Cloudflare Workers Builds — cvt-website (cvt.co.ug marketing)

**Worker name:** `cvt-website`  
**Must NOT use:** `wrangler.toml` / `npm run build` / `./dist` (that is JasiLab — wrong site)

## Dashboard → Workers & Pages → cvt-website → Settings → Builds

| Setting | Correct value |
|---------|----------------|
| Production branch | `main` |
| **Build command** | `npm run build:cvt:superhuman` |
| **Deploy command** | `npx wrangler deploy --config wrangler.cvt.toml` |
| Root directory | `/` (repo root) |

Output directory is **`dist-cvt/`** via `wrangler.cvt.toml` — do not set a Pages output dir.

## Domains & Routes

| Domain | Worker |
|--------|--------|
| `cvt.co.ug` | **`cvt-website` only** (if marketing stays on worker) |
| `jasilab.net` | **`jasilab-website` only** |

If `cvt.co.ug` shows **JasiLab — Research & Products**, the domain is on **`jasilab-website`** or `cvt-website` was deployed with **`wrangler.toml`** (serves `./dist`).

## Verify after deploy

```bash
curl -s https://cvt.co.ug/ | grep -o '<title>[^<]*'
# Expected title: CVT — Trust. Visibility. Accountability.
# Expected skin: superhuman (grep theme-superhuman or sh-scroll in HTML)
# Wrong title:   JasiLab — Research & Products (wrangler.toml / dist/)
# Wrong skin:    default dark product home (same as jasilab.net/cvt — build:cvt without :superhuman)
```

Local build check:

```bash
npm run build:cvt
grep -o '<title>[^<]*' dist-cvt/index.html   # CVT
grep -o '<title>[^<]*' dist/index.html        # JasiLab
```

## GitHub Actions

Workflow **Deploy cvt.co.ug** (`.github/workflows/deploy-cvt-website.yml`) runs on every `main` push and uses the correct build. If Dashboard Builds also runs with wrong commands, the last deploy wins — fix or disable the duplicate project.

## Registry app (Vercel)

Apply, My CVT, plate lookup: **`https://www.cvt.co.ug`** (`workspace-cvt` on Vercel).  
Do not point apex DNS at the worker if the full app should live on Vercel — see `workspace-cvt/docs/CVT_CO_UG_DOMAIN.md`.
