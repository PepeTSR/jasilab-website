# CVT public vs private content (marketing site)

Canonical working copy also lives in **workspace-cvt**: `docs/ops/MARKETING_CONTENT_MATRIX.md`.

## Partner pack

Full (unredacted) guides: `docs/partner-pack/guides/` — **not** published by Astro.

Public stubs: `src/content/cvt/guides/*.md`

## After deploy — smoke

```bash
curl -sL https://cvt.co.ug/guides/moderation-framework/ | grep -E 'Stage B|COMPLAINT_TRUST|85–90|/api/v1' || echo OK
curl -sL https://cvt.co.ug/guides/insurance/ | grep -E 'X-Consent-Token|trust-search' || echo OK
```
