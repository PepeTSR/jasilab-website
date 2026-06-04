---
title: "Partner Integration Guide"
description: "API authentication, search categories, access tiers, and audit requirements for CVT partners."
order: 2
---

This guide covers how partner organisations integrate with CVT Trust Profile APIs on **cvt.jasilab.net**. Every partner lookup requires credentials, **purpose-specific consent**, and a declared search category.

## Before you integrate

1. **Partner onboarding** — CVT Trust Team creates your `trust_partners` profile with:
   - API key (`Authorization: Bearer …`)
   - Allowed consent purposes (insurance, employment, finance)
   - Allowed access tiers (Soft, Enhanced, Hard)
   - Partner risk class and search category permissions

2. **Contract** — Hard Search requires an enterprise contract reference, expiry date, and annual review. It is never automatic for all insurers.

3. **Consent** — Registrants must grant consent to **your organisation** for **your purpose** before any partner search. See [Consent Framework](/cvt/guides/consent-framework).

## Base URL

```
https://cvt.jasilab.net/api/v1/partner/
```

## Authentication

All partner endpoints require:

| Header | Value |
|--------|--------|
| `Authorization` | `Bearer {partner_api_key}` |
| `X-Consent-Token` | Consent token issued to the registrant for your partner + purpose |

Missing or invalid credentials return `401`. Consent mismatch returns `403`.

## Primary endpoint — Trust Search

```http
POST /api/v1/partner/trust-search
Authorization: Bearer {partner_api_key}
X-Consent-Token: {consent_token}
Content-Type: application/json

{
  "verification_id": "CVT-RDR-2026-000042",
  "search_category": "employment",
  "context": {
    "role_title": "Delivery rider",
    "location": "Kampala"
  }
}
```

### Search categories

| Category | Purpose | Typical tier |
|----------|---------|--------------|
| `employment` | Hiring / role assessment | Soft + Enhanced |
| `fleet_onboarding` | Fleet operator onboarding | Soft + Enhanced |
| `financing` | SACCO / MFI decision support | Soft only |
| `insurance_underwriting` | Insurance application | Soft + Enhanced (+ Hard if contracted) |

The API resolves the access tier from your partner profile and the search category. Requests above your allowed tier are rejected.

### Insurance Hard Search

For entitled insurers with `insurance_underwriting`, include an application reference as justification:

```json
{
  "verification_id": "CVT-RDR-2026-000042",
  "search_category": "insurance_underwriting",
  "context": {
    "application_reference": "POL-2026-004821"
  }
}
```

Without `application_reference`, entitled partners receive Soft/Enhanced only.

## Other endpoints

| Endpoint | Use |
|----------|-----|
| `GET /api/v1/partner/profile` | Your partner profile and capabilities |
| `GET /api/v1/partner/trust-summary/{verificationId}` | Summary standing (tier-dependent) |
| `GET /api/v1/partner/employment-summary/{verificationId}` | Employment-oriented summary |
| `GET /api/v1/restricted/conduct-history/{verificationId}` | Hard Search conduct rows (entitled partners only; requires justification header) |

## Access tier summary

| Tier | Who | What they receive |
|------|-----|-------------------|
| **Soft Search** | Consent-based partners | Aggregates — level, standing, event counts, severity band. No categories or dates. |
| **Enhanced Search** | Employers, logistics | Counts + severity + recovery period. Still no narratives or complainant identity. |
| **Hard Search** | Contracted insurers, vetted fleet | Category + severity + month + status per conduct event. Never complainant or evidence. |

SACCOs: **Soft only**. Employers: **never Hard**. See party matrix in [Trust Profile](/cvt/docs/trust-profile).

## Partner portal

CVT provides a web partner portal at `https://cvt.jasilab.net/{locale}/partner` for manual searches during integration and testing. Production integrations should use the API.

## Audit and compliance

Every partner API call is logged to `trust_profile_access_log`:

- Partner ID
- Access tier served
- Verification ID
- Consent reference
- Timestamp

Hard Search additionally requires per-query justification and writes to `partner_search_requests`.

**Do not:**

- Bulk-fish verification IDs without registrant consent
- Share API keys across organisations
- Store conduct detail beyond your contract scope
- Present CVT output as a credit score or automatic approval

## Error handling

| Status | Meaning |
|--------|---------|
| `401` | Invalid or missing API key |
| `403` | Consent invalid, expired, wrong purpose, or tier not allowed |
| `404` | Verification ID not found or registrant not verified |
| `400` | Missing required fields (e.g. justification for Hard Search) |

## Integration checklist

- [ ] Partner profile created with correct purposes and tiers
- [ ] Consent UX implemented in your application flow
- [ ] Search category mapped to your use case
- [ ] Error handling and disclaimers shown to end users
- [ ] Audit retention aligned with your privacy policy
- [ ] Hard Search contract in place (insurers only, if applicable)

## Further reading

- [Consent Framework](/cvt/guides/consent-framework)
- [Insurance Guide](/cvt/guides/insurance)
- [Employment Guide](/cvt/guides/employment)
- [Trust Profile specification](/cvt/docs/trust-profile)
