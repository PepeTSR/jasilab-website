---
title: "Insurance Guide"
description: "Using CVT Trust Profile for underwriting — insurance signals, tiers, and Hard Search eligibility."
order: 3
---

CVT prioritises **insurance before credit**. Insurer-grade signals — active cover, continuity, training — are first-class inputs to the Trust Profile long before any credit bureau integration (planned v5+).

## Why insurers use CVT

Informal mobility operators often lack a portable record insurers can trust. CVT provides:

- **Verified identity and registration** linked to a verification ID
- **Insurance continuity milestones** (`INSURANCE_ACTIVE`, `INSURANCE_CONTINUITY_MILESTONE`)
- **Training and compliance** (road safety, first aid, defensive riding)
- **Moderated conduct history** — only after two-stage trust moderation, never raw complaints

CVT does **not** approve claims or guarantee insurability. You apply your own underwriting rules to exported facts.

## Insurance-relevant trust events

| Event | When emitted |
|-------|--------------|
| `INSURANCE_ACTIVE` | Cover verified active on record |
| `INSURANCE_CONTINUITY_MILESTONE` | Unbroken cover (e.g. 12m / 24m) |
| `INSURANCE_LAPSED` | Cover ended — informational; weight in your policy |
| `ROAD_SAFETY_CERTIFIED` | Verified training |
| `FIRST_AID_CERTIFIED` | Verified training |
| `CLEAN_PERIOD_24M` | No trust-affecting conduct in 24 months |

Conduct events (`COMPLAINT_TRUST_VERIFIED`, `COMPLAINT_TRUST_SEVERE`) appear only after [Stage B moderation](/cvt/guides/moderation-framework).

## Access tiers for insurers

| Tier | Typical insurer use | Requires |
|------|---------------------|----------|
| **Soft Search** | Initial screening, premium banding | Consent + API key |
| **Enhanced Search** | Deeper risk assessment | Consent + employment-grade profile |
| **Hard Search** | Underwriting with conduct categories | Consent + **enterprise contract** + per-query justification |

**Hard Search is privileged access** — not automatic for every `partner_type = insurer`. CVT enables it per partner when:

- `hard_search_contract_ref` is on file
- Contract is not expired or revoked (`hard_search_expires_at`, `hard_search_revoked_at`)
- Named users and audit requirements are met

## API flow for underwriting

1. Registrant applies for cover and grants consent:

   > "I consent to ABC Insurance accessing my CVT Trust Profile for **underwriting**."

2. Your system obtains a **consent token** from CVT (purpose: insurance).

3. Call Trust Search:

```http
POST /api/v1/partner/trust-search
Authorization: Bearer {partner_api_key}
X-Consent-Token: {consent_token}

{
  "verification_id": "CVT-RDR-2026-000042",
  "search_category": "insurance_underwriting",
  "context": {
    "application_reference": "POL-2026-004821"
  }
}
```

4. If entitled to Hard Search, the response may include conduct rows:

```text
Category:   Dangerous driving
Severity:   Moderate
Date:       March 2024
Status:     Resolved
```

**Never returned:** complainant identity, phone numbers, evidence files, witness statements.

## What Soft Search shows (all entitled insurers)

```text
Trust level:              Gold
Current standing:         Good
Trust-affecting events:   1 (resolved)
Months since last event:  36
Active suspension:        No
Highest severity:         Moderate
```

Aggregates only — no categories, narratives, or dates.

## Sealed records and rehabilitation

After **5 years** + **clean recovery**, moderate conduct events may be **sealed**. Sealed events are:

- Visible to the registrant (indicator only)
- **Excluded** from Hard Search and all partner tiers
- Available only to CVT Trust Team and lawful disclosure

Permanent punishment destroys trust systems — rehabilitation is a product principle.

## Weighting in your policy

CVT publishes a **trust level** and **Good Standing** under versioned policy (`trust-v1.0.0`). Insurers may apply **their own weighting** on exported facts within contract — separate from CVT's public level.

Recommended approach:

- Use insurance continuity and training as **positive gates**
- Treat single upheld moderate conduct as **light factor**, not automatic decline
- Require repeat upheld pattern before strong negative action (aligned with CVT v1 philosophy)

## Language requirements

| Use | Avoid |
|-----|-------|
| Trust profile for **underwriting** | "Credit score", "CRB check" |
| Registry-verified facts | "Safety guarantee", "claim approved" |
| Partner applies own policy | "CVT approved this rider" |

## Checklist for insurer partners

- [ ] Enterprise contract and Hard Search entitlement confirmed with CVT
- [ ] Consent copy reviewed for insurance purpose
- [ ] Application reference captured as Hard Search justification
- [ ] Underwriters trained on tier differences (Soft vs Hard)
- [ ] Disclaimers shown in your application UI
- [ ] Annual contract review scheduled

## Further reading

- [Partner Integration Guide](/cvt/guides/partner-integration)
- [Consent Framework](/cvt/guides/consent-framework)
- [Moderation Framework](/cvt/guides/moderation-framework)
- [Trust Profile specification](/cvt/concepts/trust-profile)
