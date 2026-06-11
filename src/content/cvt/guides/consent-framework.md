---
title: "Consent Framework"
description: "Purpose-specific consent for partner access — grants, expiry, revocation, and registrant transparency."
order: 5
---

CVT Trust Profile partner access is **consent-gated**. Registrants control who sees their standing, for what purpose, and for how long. Consent is never a blanket "share everything" toggle.

## Core principles

1. **Purpose-specific** — insurance ≠ employment ≠ finance
2. **Per partner** — consent to ABC Insurance does not cover XYZ Logistics
3. **Per verification ID** — tied to the registered subject
4. **Time-limited** — expires; must be renewed for new decisions
5. **Revocable** — registrant can withdraw consent; future searches fail
6. **Audited** — every partner access logged; registrant can see who viewed

## Consent purposes

| Purpose | Example consent copy | Unlocks |
|---------|---------------------|---------|
| **Insurance** | "Allow ABC Insurance to access my Trust Profile for **underwriting**." | Soft; Enhanced/Hard if insurer contract |
| **Employment** | "Allow DHL Uganda to access my Trust Profile for **employment assessment**." | Soft + Enhanced |
| **Finance** | "Allow XYZ SACCO to access my Trust Profile for **financing decision support**." | Soft only |
| **Law enforcement** | No registrant consent where legally mandated | Manual disclosure by CVT Trust Team only |

Search category on the API must match the consent purpose. A finance consent token cannot be used for an `employment` search — the API returns `403`.

## Consent lifecycle

```text
Registrant grants consent (partner + purpose + verification ID)
        ↓
CVT issues consent_token (expires_at set)
        ↓
Partner presents token on API call (+ own API key)
        ↓
CVT validates: active, not revoked, partner match, purpose match, ID match
        ↓
Access logged → registrant visible in passport history
        ↓
Expiry or revocation → further searches rejected
```

### Consent record fields

- `partner_id` — which organisation
- `purpose` — insurance | employment | finance (enum)
- `verification_id` — which registration
- `rider_id` — linked registrant
- `granted_at`, `expires_at`
- `revoked_at` (null while active)
- `consent_token` — presented by partner on API calls

## Partner API headers

```http
Authorization: Bearer {partner_api_key}
X-Consent-Token: {consent_token}
```

Both are required on `POST /api/v1/partner/trust-search` and related endpoints.

Validation failures:

| Error | Cause |
|-------|-------|
| Invalid or expired consent token | Expired or unknown token |
| Consent token does not match partner | Token issued for different partner |
| Consent token does not match verification ID | ID mismatch in request body |
| Consent purpose does not match search category | Employment token used for insurance search |
| Partner type cannot use this consent purpose | Profile restriction |

## Registrant transparency

Registrants see **who accessed** their Trust Profile:

- Partner organisation name
- Purpose (insurance, employment, finance)
- Access tier served (Soft, Enhanced, Hard)
- Date

Available on:

- **Public passport** — `/passport/{verificationId}` with registered mobile unlock
- **Admin rider profile** — for CVT support staff

Registrants do **not** see partner internal notes, loan amounts, or application reference numbers in v1.

## Shareable consent codes

CVT supports consent flows where registrants generate a **shareable code** for a specific partner and purpose (implemented in the trust consent UX). Partners enter the code in the partner portal or exchange it for a consent token via your integration flow.

## Hard Search and consent

Hard Search requires **both**:

- Valid registrant consent (where applicable)
- **Enterprise contract** on the partner profile

Contract is additional — it never substitutes for consent on underwriting searches involving the registrant.

Law enforcement and courts: **no self-service API**. Manual disclosure only where legally mandated, logged to `law_enforcement_access_log`.

## UX guidelines for partners

When building consent into your application:

- Show **plain-language** purpose text — not legalese buried in terms
- Name your organisation explicitly in the consent sentence
- Explain what tier of data you will receive (aggregates vs enhanced)
- Link to CVT disclaimer: not a credit score or automatic approval
- Allow registrant to decline without penalty to unrelated CVT services
- Do not pre-check consent boxes

## Finance partners — language rules

Use **trust profile for financing decision support**. Do **not** use:

- "Credit score"
- "Credit scoring"
- "Credit check"

CRB integration is a separate v5+ programme requiring licensing. Until then, CVT provides registry-verified trust signals for **your** policy — not bureau scoring.

## Disputes and revocation

Registrants may:

- **Revoke** consent at any time — future API calls fail
- **Dispute** trust events via CVT Trust Team → may result in `EVENT_REVERSED` and snapshot recompute
- **Dispute seal eligibility** on rehabilitated records

Revocation does not delete audit logs of past accesses.

## Required disclaimer

> CVT Trust Profile and Trust Timeline summarise information verified in the CVT registry and complaint outcomes that completed trust moderation. They are not a credit score, safety rating, or insurance approval. Partners apply their own policies.

## Checklist

- [ ] Consent copy approved for your purpose
- [ ] Token stored securely; not logged in client-side analytics
- [ ] Purpose matches search_category on every API call
- [ ] Expiry handling — prompt re-consent before decision
- [ ] Revocation honoured immediately
- [ ] Registrant-facing disclaimer displayed

## Further reading

- [Partner Integration Guide](/cvt/guides/partner-integration)
- [Moderation Framework](/cvt/guides/moderation-framework)
- [Trust Profile specification](/cvt/concepts/trust-profile)
