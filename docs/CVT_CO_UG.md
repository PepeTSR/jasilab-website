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
3. Build command: `npm run build:cvt:superhuman`
4. Deploy command: `npx wrangler deploy --config wrangler.cvt.toml`
5. Settings → Domains → Add **cvt.co.ug** only (not jasilab.net)

## jasilab.net must stay separate

| Domain | Worker | Build |
|--------|--------|-------|
| jasilab.net | `jasilab-website` | `npm run build` + `wrangler deploy` |
| cvt.co.ug | `cvt-website` | `npm run build:cvt:superhuman` + `wrangler.cvt.toml` |

**If jasilab.net redirects to cvt.co.ug entirely**, check Cloudflare:

1. **DNS** — `jasilab.net` must not CNAME to `cvt.co.ug`
2. **Rules → Redirect Rules** — delete any rule sending `jasilab.net/*` → `cvt.co.ug`
3. **Workers → Domains** — `jasilab.net` on `jasilab-website` only; `cvt.co.ug` on `cvt-website` only

## Troubleshooting cvt.co.ug

**Homepage shows JasiLab, subpages 404**

`cvt.co.ug` is on the wrong worker or `cvt-website` deployed with `wrangler.toml` (`dist/`) instead of `wrangler.cvt.toml` (`dist-cvt/`).

Quick check: `curl -s https://cvt.co.ug/ | grep '<title>'` should show **CVT — Trust**, not JasiLab.

**Homepage shows HAY, CareHome or “Research & Products”**

Same root cause — `cvt.co.ug` is serving the JasiLab `dist/` build. The CVT homepage has no other JasiLab products. Redeploy **cvt-website** only (`build:cvt:superhuman` + `wrangler.cvt.toml`).

**Homepage looks like jasilab.net/cvt (dark product layout, no scroll hero)**

The worker was built with the **default** theme (`npm run build:cvt`), not **superhuman** (`npm run build:cvt:superhuman`). Same title, wrong skin — matches `localhost:4322`, not `localhost:4324`.

```bash
curl -s https://cvt-website.levitumwine50.workers.dev/ | grep -oE 'theme-superhuman|sh-scroll'
# Expected: both present after correct deploy
```

**`/en/apply`, `/en/my-cvt`, etc. return 404 on apex**

The marketing worker serves **`cvt.co.ug`** (homepage, `/platform/`, …). The Next.js app (apply, my-cvt, lookup) runs on **`www.cvt.co.ug`** (Vercel).

Add a **Cloudflare Redirect Rule** on the `cvt.co.ug` zone:

| Setting | Value |
|---------|--------|
| **When** | Hostname equals `cvt.co.ug` AND URI Path matches regex `^/(en\|lg)(/|$)` or starts with `/plate` |
| **Then** | Dynamic redirect to `https://www.cvt.co.ug${uri.path}` (302) |

Working URLs today: `https://www.cvt.co.ug/en/my-cvt`, `https://www.cvt.co.ug/en/apply`.

Marketing links should use **`www.cvt.co.ug`** for app routes (`src/lib/site.ts` → `cvtPublicAppUrl`).

## App vs marketing

| URL | Purpose |
|-----|---------|
| cvt.co.ug | CVT marketing homepage (Cloudflare Worker) |
| www.cvt.co.ug | Public app — apply, my-cvt, lookup (Vercel) |
| jasilab.net | JasiLab research & products |
| jasilab.net/cvt | CVT on JasiLab (same content, `/cvt` prefix) |
| cvt.ug | Staff portal (Vercel) |
