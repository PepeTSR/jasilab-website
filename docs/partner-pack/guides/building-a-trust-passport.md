---
title: "Building a Trust Passport"
description: "How registry facts become a portable Trust Passport — profile, timeline, standing, and public API."
order: 1
---

A **Trust Passport** is the public-facing bundle of a registrant's CVT Trust Profile. It is not a separate database — it is a composed view of verified facts, policy-derived standing, and a positive-dominant timeline.

## What a passport contains

| Surface | Contents |
|---------|----------|
| **Profile** | Name, category, verification status, tenure, training and insurance highlights |
| **Trust level** | Bronze → Platinum — derived from verified positive signals over time |
| **Good Standing** | Policy indicator — not a safety guarantee |
| **Trust Timeline** | Public milestones only (verification, training, insurance, clean periods) |
| **Trust statements** | Plain-language highlights localised in English and Luganda |

Conduct detail **never** appears on the public passport — only a standing indicator (Good Standing / Review Required / Not in Good Standing).

## Three layers behind the passport

```text
Registry (verified records)
        ↓ emit
trust_events (immutable facts)
        ↓ compute (policy version)
trust_profile_snapshots (interpretation cache)
        ↓ filter (access tier)
Public passport / Partner APIs
```

**Connect consumes trust; it is not the profile engine.** Dispatch and channels read the passport — they do not compute trust level.

## Prerequisites

Before a passport exists:

1. Registrant completes **registry verification** (`status = verified`)
2. A **verification ID** is issued (e.g. `CVT-RDR-2026-000042`)
3. The **trust compute job** runs and writes a snapshot

Unverified or suspended registrations do not publish a passport.

## How events enter the timeline

Positive events are emitted when CVT verifies facts:

- `PROFILE_VERIFIED` — first verification
- `INSURANCE_ACTIVE`, `FIRST_AID_CERTIFIED`, `ROAD_SAFETY_CERTIFIED`
- `CLEAN_PERIOD_12M`, `CLEAN_PERIOD_24M`
- `GOLD_ACHIEVED`, `PLATINUM_ACHIEVED` (on upward level crossings)

Conduct events enter **only after Stage B moderation** completes — never from raw complaint intake. See the [Moderation Framework](/cvt/guides/moderation-framework).

## Public URLs and API

| Channel | URL / endpoint |
|---------|----------------|
| **Web passport** | `https://cvt.ug/{locale}/passport/{verificationId}` |
| **Public API (JSON)** | `GET /api/v1/passport/{verificationId}?format=json` |

Example JSON fields: `verification_id`, `trust_level`, `standing`, `profile`, `timeline`, `policy_version`, `disclaimers`.

## Owner vs public view

| Viewer | What they see |
|--------|---------------|
| **Anyone (Tier 1)** | Public passport — positive timeline, standing indicator, no conduct detail |
| **Registrant (Tier 0)** | Full own history including conduct categories, moderation outcomes, sealed-record indicators |
| **Partners** | Soft / Enhanced / Hard search tiers — with [consent](/cvt/guides/consent-framework) |

Registrants can see **who accessed** their profile (partner org, purpose, date) when they unlock the passport with a registered mobile match.

## Required language

When presenting a passport:

- CVT **verifies submitted registration information** and maintains an accountability record.
- Trust level means **more verified positive signals over time** — not "safe driver" or "loan approved."
- This is **not** a credit score, safety rating, or insurance approval.

> CVT Trust Profile and Trust Timeline summarise information verified in the CVT registry and complaint outcomes that completed trust moderation. They are not a credit score, safety rating, or insurance approval. Partners apply their own policies.

## Implementation checklist

- [ ] Registry verification complete
- [ ] Required documents accepted
- [ ] Training / insurance events verified where applicable
- [ ] Trust snapshot computed under current policy version
- [ ] Public passport URL tested
- [ ] Disclaimers displayed on UI and API responses

## Further reading

- [Trust Profile concept](/cvt/concepts/trust-profile)
- [Trust Architecture overview](/cvt/concepts/trust-passport)
- [Consent Framework](/cvt/guides/consent-framework)
