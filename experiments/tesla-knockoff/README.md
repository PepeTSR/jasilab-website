# Tesla knockoff (CVT design experiment)

Parked prototype: Tesla-inspired white/minimal skin for **cvt.co.ug**, inspired by
`awesome-design-md-main/design-md/tesla/DESIGN.md`.

**Status:** Not wired into production. Return here when revisiting the direction.

## What's in this folder

| File | Purpose |
|------|---------|
| `src/lib/cvt-theme.ts` | `PUBLIC_CVT_THEME=tesla` toggle |
| `src/styles/cvt-tesla.css` | Tesla tokens + homepage layout classes |
| `src/components/cvt-home/CvtHomeProductTesla.astro` | Full-viewport hero homepage |
| `INTEGRATION.md` | How to plug back into the main site |
| `package-script.txt` | Dev command to preview locally |

## Preview locally (after re-integrating)

See `INTEGRATION.md` — copy files into `src/`, apply wiring patches, then:

```bash
npm run dev:cvt:tesla
# http://localhost:4323/cvt/
```

## Design notes

- Electric Blue `#3E6AE1` for primary CTAs only
- White canvas, system sans (Universal Sans unavailable — use `-apple-system`)
- Full-viewport hero + gallery-style sections
- Placeholder Unsplash images — swap for real Kampala/CVT photography
- Never deployed to cvt.co.ug
