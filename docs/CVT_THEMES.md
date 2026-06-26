# CVT.co.ug theme templates

Three deployable skins for **cvt.co.ug** (marketing site). The live app stays at **cvt.ug**.

| Theme | Env | Homepage | Nav highlights |
|-------|-----|----------|----------------|
| **default** | _(none)_ | Dark product home | Vision · Try lookup · Registry |
| **superhuman** | `PUBLIC_CVT_THEME=superhuman` | Scroll hero + platform band | Platform · Guides · Get verified |
| **tesla** | `PUBLIC_CVT_THEME=tesla` | Full-screen hero + panels | Platform · Guides · Get verified |

Shared copy lives in `src/lib/cvt-home-content.ts` — update once, all themes stay aligned.

## Local dev

```bash
npm run dev:cvt              # default — http://localhost:4322/cvt/
npm run dev:cvt:superhuman     # http://localhost:4324/cvt/
npm run dev:cvt:tesla          # http://localhost:4325/cvt/
```

## Build

```bash
npm run build:cvt              # dist-cvt/ — default
npm run build:cvt:superhuman
npm run build:cvt:tesla
npm run verify:cvt:themes      # all three
```

Each build writes `dist-cvt/.cvt-build-theme` with the theme name.

## Deploy (manual)

```bash
npm run deploy:cvt              # default → cvt.co.ug
npm run deploy:cvt:superhuman
npm run deploy:cvt:tesla
```

## Deploy (GitHub Actions)

**Push to `main`** deploys the **default** theme.

**Actions → Deploy cvt.co.ug → Run workflow** and choose:

- `default` — current dark product site
- `superhuman` — indigo scroll prototype
- `tesla` — Tesla-style full-bleed prototype

## Key files

| File | Purpose |
|------|---------|
| `src/lib/cvt-theme.ts` | Theme detection |
| `src/lib/cvt-home-content.ts` | Shared homepage copy |
| `src/lib/site.ts` | `cvtPublicAsset()` for root paths |
| `src/components/cvt-home/CvtHomeProduct.astro` | Default home |
| `src/components/cvt-home/CvtHomeProductSuperhuman.astro` | Superhuman home |
| `src/components/cvt-home/CvtHomeProductTesla.astro` | Tesla home |
| `src/styles/cvt-superhuman.css` | Superhuman styles |
| `src/styles/cvt-tesla.css` | Tesla styles |
| `scripts/build-cvt.mjs` | Theme-aware build |
| `scripts/package-cvt-site.mjs` | Lift `/cvt` → root, rewrite paths |

## Platform page

`/platform/` is available for **superhuman** and **tesla** only. Default theme redirects to home.

## Partners

On `/partners/`, header CTA is **Enterprise** → `https://cvt.ug/enterprise` (all themes).
