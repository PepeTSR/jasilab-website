---
title: "Moderation Framework"
description: "Two-stage complaint moderation — Stage A operations and Stage B trust eligibility before any reputation impact."
order: 6
---

Trust must **never** react to intake noise. CVT separates **operational complaint handling** (Stage A) from **trust eligibility** (Stage B). Raw accusations, rumours, and uninvestigated reports do **not** affect the Trust Profile.

## Why two stages?

Informal economies run on word of mouth. A single anonymous complaint can destroy a livelihood if it instantly hits a public score. CVT's moderation framework ensures:

- Complaints are **investigated** before trust impact
- **Anonymous** complaints are excluded by default
- **Single** upheld complaints have **light** v1 impact — repeat patterns matter more
- **Rehabilitation** is built in — sealed records after clean recovery

## Stage A — Operational workflow

Stage A is existing CVT complaint ops — unchanged in spirit:

| State | Meaning |
|-------|---------|
| `new` | Intake recorded |
| `under_review` | Investigation in progress |
| Ops notes, evidence, plate linkage | Internal only |

**Stage A does not affect trust.** Investigators work the case without changing Trust Profile, trust level, or passport standing.

## Stage B — Trust eligibility

A complaint affects trust **only** after trust moderation completes:

```text
New
  ↓
Investigating
  ↓
Verified          → may affect trust (standard upheld)
  ↓
Severe            → may affect trust (stronger factor)
```

| Trust moderation state | Affects Trust Profile? |
|------------------------|-------------------------|
| **New** | **No** |
| **Investigating** | **No** |
| **Verified** | **Yes** — negative factor (light in v1) |
| **Severe** | **Yes** — stronger negative factor |
| Dismissed / duplicate / insufficient info | **No** |

When Stage B completes as Verified or Severe, CVT emits conduct `trust_events`:

- `COMPLAINT_TRUST_VERIFIED`
- `COMPLAINT_TRUST_SEVERE`

These events carry `conduct_category` for Hard Search (e.g. `dangerous_driving`) but are **never** on the public timeline.

## What never affects trust

- Raw accusations not yet through Stage B
- Rumours or unverified third-party reports
- **Anonymous** complaints (unless identity verified to CVT standard — default: **exclude**)
- Single complaints without repeat pattern (v1 caps meaningful penalty)
- Complaints linked only to unverified plates with no verified subject
- Dismissed, duplicate, or insufficient-info outcomes

## Visibility after Stage B

| Surface | Conduct visible? |
|---------|------------------|
| **Public passport** | Standing indicator only — Good / Review Required / Not in Good Standing |
| **Soft Search** | Aggregates — count, severity band, months since last event |
| **Enhanced Search** | Counts + recovery period — still no categories |
| **Hard Search** | Category + severity + month + status — insurers with contract only |
| **Owner view (Tier 0)** | Full conduct history including categories and outcomes |

Narratives, witness statements, complainant identity, and moderator notes **never** leave CVT — at any tier.

## v1 penalty philosophy

v1 is **overwhelmingly positive** (~85–90% of trust level from positive signals). Negatives are **light** and **late**:

| Signal | v1 impact |
|--------|-----------|
| `COMPLAINT_UPHELD_TRUST` (Stage B Verified) | Light; single event capped |
| `COMPLAINT_SEVERE_TRUST` (Stage B Severe) | Moderate |
| `COMPLAINT_REPEAT_UPHELD` (2+ in 24m) | Moderate |
| `SUSPENSION_ACTIVE` | Strong — blocks Gold+ |
| `FRAUD_CONFIRMED` | Strong |

A long clean record with one old upheld complaint should not destroy Platinum tenure — policy recomputes under versioned rules without rewriting history.

## Audit requirements

Every trust-affecting factor must reference:

- `complaint_id` or evidence document ID
- Moderator staff ID
- Timestamp
- Stage B outcome

Conduct events are append-only in `trust_events`. Corrections use `EVENT_REVERSED` compensating entries — never silent edits.

## Rehabilitation and sealed records

After policy thresholds (direction: **5 years** + **clean recovery** + **moderate events only**):

- Event marked `is_sealed = true`
- `RECORD_SEALED` emitted
- **Excluded** from Soft, Enhanced, and Hard Search
- Registrant sees indicator: "sealed after rehabilitation"
- CVT Trust Team and lawful disclosure only

Severe events may follow stricter seal rules — policy TBD.

Permanent punishment destroys trust systems. Complaints should not permanently destroy reputations.

## Moderator workflow checklist

### Stage A (ops)

- [ ] Complaint intake with verifiable subject link where possible
- [ ] Investigation notes documented
- [ ] Do not change trust moderation until investigation complete

### Stage B (trust team)

- [ ] Confirm identity standard met (not anonymous unless verified)
- [ ] Select outcome: Verified, Severe, or Dismissed
- [ ] Assign `conduct_category` if Verified/Severe (for Hard Search tier)
- [ ] Emit trust event — triggers snapshot recompute
- [ ] Registrant may dispute → Trust Team review → possible `EVENT_REVERSED`

## Connect and public layers

Passengers and riders on Connect see **trust level** and **Good Standing** badge — not conduct detail. Partner tiers are not exposed in consumer apps.

## Required positioning

- CVT maintains an **accountability record** — not a rumour ledger
- Higher trust levels mean **verified positive signals over time**
- **Not** "safe driver", "trustworthy person", or legal finding of guilt

## Further reading

- [Building a Trust Passport](/cvt/guides/building-a-trust-passport)
- [Consent Framework](/cvt/guides/consent-framework)
- [Insurance Guide](/cvt/guides/insurance) — Hard Search conduct rows
- [Employment Guide](/cvt/guides/employment) — what employers never see
- [Trust Profile specification](/cvt/docs/trust-profile)
