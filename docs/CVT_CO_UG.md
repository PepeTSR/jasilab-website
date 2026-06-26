# CVT on cvt.co.ug

CVT public marketing content moved from `jasilab.net/cvt` to **https://cvt.co.ug** (root paths).

## Architecture

- **One repo** (`jasilab-website`), two Cloudflare Workers:
  - `jasilab-website` → jasilab.net (JasiLab + redirects)
  - `cvt-website` → cvt.co.ug (CVT pages at `/`, not `/cvt`)
- **Path helper** `src/lib/site.ts` — `PUBLIC_CVT_BASE` empty for cvt.co.ug, `/cvt` for jasilab
- **Package step** `scripts/package-cvt-site.mjs` lifts `dist/cvt/` → `dist-cvt/` and rewrites links

## Cloudflare setup for cvt.co.ug

1. Dashboard → Workers & Pages → Create → `cvt-website`
2. Connect same GitHub repo
3. Build command: `npm run build:cvt`
4. Deploy command: `npx wrangler deploy --config wrangler.cvt.toml`
5. Settings → Domains → Add **cvt.co.ug**

## jasilab.net redirects

`public/_redirects` sends `/cvt` and `/cvt/*` to cvt.co.ug (301).

## App vs marketing

| URL | Purpose |
|-----|---------|
| cvt.co.ug | Public story, vision, guides, concepts |
| cvt.jasilab.net | Live registry app (workspace-cvt) |
| jasilab.net | JasiLab lab site |
