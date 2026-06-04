---
title: "Employment Guide"
description: "Hiring and fleet onboarding with CVT — Enhanced Search, consent, and what employers may see."
order: 4
---

Employers and logistics firms use CVT to assess commercial operators with **consent-based** access — without exposing harassment narratives, witness statements, or insurer-only conduct categories.

## Use cases

- Hiring boda riders, taxi drivers, or delivery operators
- Fleet onboarding for logistics companies
- Periodic re-checks for contracted operators
- SACCO-affiliated operator verification (Soft Search only for SACCOs)

## What employers receive

Employers typically access **Soft Search** and **Enhanced Search** — **never Hard Search**.

| Tier | Employer-visible data |
|------|----------------------|
| **Soft Search** | Trust level, standing, aggregate event counts, months since last event, highest severity band |
| **Enhanced Search** | Verified event count, highest severity, recovery period (e.g. 24 months clean) |

**Never visible to employers:**

- Complaint descriptions or categories (Hard Search / insurer-only)
- Witness statements or complainant identity
- Moderator notes
- Uninvestigated or Stage A complaints

This boundary protects registrants while giving employers enough signal for hiring decisions.

## Consent requirement

Before any search, the applicant must grant **employment-purpose** consent:

> "I consent to DHL Uganda viewing my CVT Trust Profile for **employment assessment**."

Consent is:

- **Per partner** — not transferable between employers
- **Per purpose** — employment consent does not unlock insurance underwriting
- **Time-limited** — expires; revocable by registrant

See [Consent Framework](/cvt/guides/consent-framework).

## API integration

```http
POST /api/v1/partner/trust-search
Authorization: Bearer {partner_api_key}
X-Consent-Token: {consent_token}

{
  "verification_id": "CVT-RDR-2026-000042",
  "search_category": "employment",
  "context": {
    "role_title": "Last-mile delivery rider",
    "location": "Entebbe"
  }
}
```

Alternative category for fleet operators: `fleet_onboarding`.

### Employment summary endpoint

```http
GET /api/v1/partner/employment-summary/{verificationId}
Authorization: Bearer {partner_api_key}
X-Consent-Token: {consent_token}
```

Returns employment-oriented standing and recovery metrics where your partner profile allows Enhanced tier.

## Interpreting results

### Positive signals to weigh

- Verified tenure and current re-verification
- Training certificates (road safety, first aid)
- Active insurance on record
- Clean periods (12m / 24m without trust-affecting conduct)
- Gold or Platinum trust level

### Negative signals (after moderation only)

- Active suspension → typically blocks Good Standing
- Upheld conduct (Stage B Verified) → light factor in v1; single event capped
- Severe upheld conduct → moderate factor
- Repeat upheld pattern (e.g. 2+ in 24m) → stronger factor

**Investigating** or **new** complaints do **not** appear — trust never reacts to intake noise.

## Enhanced Search example

```text
Current standing:         Good
Active suspension:        No
Verified trust events:    2
Highest severity:         Moderate
Recovery period:          24 months clean
```

Use recovery period to support rehabilitation-aware hiring — a resolved moderate event from three years ago with 24 months clean may meet your policy even if aggregates show historical severity.

## SACCO and stage leaders

| Party | Soft | Enhanced | Hard |
|-------|------|----------|------|
| Employers | ✓ | ✓ | ✗ |
| Logistics / fleet | ✓ | ✓ | ✗ |
| SACCOs | ✓ (consent) | ✗ | ✗ |
| Stage leaders | ✗ | ✗ | ✗ |

SACCO politics and rivalries create retaliation risk — SACCOs receive Soft Search only with explicit registrant consent.

## Required disclaimers

Display to hiring managers and applicants:

> CVT Trust Profile summarises registry-verified information and moderated complaint outcomes. It is not a safety guarantee, background check replacement, or hiring recommendation. Your organisation applies its own employment policies.

Do not use language implying CVT "cleared" or "approved" a candidate.

## Hiring workflow checklist

- [ ] Applicant provides CVT verification ID
- [ ] Employment consent obtained before search
- [ ] Search category set to `employment` or `fleet_onboarding`
- [ ] Results reviewed against your policy (not CVT level alone)
- [ ] Applicant can see access in their passport ("Who viewed my profile")
- [ ] Records retained per your HR data policy

## Further reading

- [Partner Integration Guide](/cvt/guides/partner-integration)
- [Consent Framework](/cvt/guides/consent-framework)
- [Moderation Framework](/cvt/guides/moderation-framework)
- [Building a Trust Passport](/cvt/guides/building-a-trust-passport)
