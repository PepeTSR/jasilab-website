# CVT on cvt.co.ug

CVT has its own product home at **https://cvt.co.ug**. JasiLab remains at **https://jasilab.net** (including `/cvt`).

## Architecture

- **One repo** (`jasilab-website`), two Cloudflare Workers:
  - `jasilab-website` → **jasilab.net** (JasiLab + CVT at `/cvt`)
  - `cvt-website` → **cvt.co.ug** (CVT pages at `/`, not `/cvt`)
- **No forced redirect** from jasilab.net to cvt.co.ug — both sites coexist
- **Path helper** `src/lib/site.ts` — `PUBLIC_CVT_BASE` empty for cvt.co.ug, `/cvt` for jasilab
- **Package step** `scripts/package-cvt-site.mjs` lifts `dist/cvt/` → `dist-cvt/` and rewrites links

## Cloudflare setup for cvt.co.ug

1. Dashboard → Workers & Pages → Create → `cvt-website`
2. Connect same GitHub repo
3. Build command: `npm run build:cvt`
4. Deploy command: `npx wrangler deploy --config wrangler.cvt.toml`
5. Settings → Domains → Add **cvt.co.ug** only (not jasilab.net)

## jasilab.net must stay separate

| Domain | Worker | Build |
|--------|--------|-------|
| jasilab.net | `jasilab-website` | `npm run build` + `wrangler deploy` |
| cvt.co.ug | `cvt-website` | `npm run build:cvt` + `wrangler.cvt.toml` |

**If jasilab.net redirects to cvt.co.ug entirely**, check Cloudflare:

1. **DNS** — `jasilab.net` must not CNAME to `cvt.co.ug`
2. **Rules → Redirect Rules** — delete any rule sending `jasilab.net/*` → `cvt.co.ug`
3. **Workers → Domains** — `jasilab.net` on `jasilab-website` only; `cvt.co.ug` on `cvt-website` only

## Troubleshooting cvt.co.ug

**Homepage shows JasiLab, subpages 404**

`cvt.co.ug` is on the wrong worker or `cvt-website` deployed with `wrangler.toml` (`dist/`) instead of `wrangler.cvt.toml` (`dist-cvt/`).

Quick check: `curl -s https://cvt.co.ug/ | grep '<title>'` should show **CVT — Trust**, not JasiLab.

## App vs marketing

| URL | Purpose |
|-----|---------|
| cvt.co.ug | CVT product home |
| jasilab.net | JasiLab research & products |
| jasilab.net/cvt | CVT on JasiLab (same content, `/cvt` prefix) |
| cvt.ug | Live registry app (workspace-cvt) |
