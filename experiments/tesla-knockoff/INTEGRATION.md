# Re-integrating Tesla knockoff

Copy files from this folder into the repo root `src/` tree:

```text
experiments/tesla-knockoff/src/lib/cvt-theme.ts
  → src/lib/cvt-theme.ts

experiments/tesla-knockoff/src/styles/cvt-tesla.css
  → src/styles/cvt-tesla.css

experiments/tesla-knockoff/src/components/cvt-home/CvtHomeProductTesla.astro
  → src/components/cvt-home/CvtHomeProductTesla.astro
```

## `src/pages/cvt/index.astro`

```astro
import CvtHomeProductTesla from "../../components/cvt-home/CvtHomeProductTesla.astro";
import { isTeslaTheme } from "../../lib/cvt-theme";

{isCvtRootSite ? (isTeslaTheme ? <CvtHomeProductTesla /> : <CvtHomeProduct />) : <CvtHomeEmbedded />}
```

## `src/layouts/CvtLayout.astro`

- Import `isTeslaTheme` from `../lib/cvt-theme`
- Conditionally `import("../styles/cvt-tesla.css")`
- Pass `teslaTheme={isTeslaTheme}` to `BaseLayout`
- Add `theme-tesla` class on wrapper when active
- Hide `CvtMobileBar` when Tesla theme is on

## `src/layouts/BaseLayout.astro`

- Add optional `teslaTheme` prop
- Skip Inter font when `teslaTheme`
- White body background when `teslaTheme`

## `src/components/CvtHeader.astro`

- Import `isTeslaTheme`
- `heroNav = isTeslaTheme && isHome` for transparent nav over hero
- Tesla wordmark when `isTeslaTheme` on product site

## `package.json`

Add script from `package-script.txt`.
