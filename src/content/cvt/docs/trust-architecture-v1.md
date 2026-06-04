---
title: "Trust Architecture v1"
description: "Facts, policy engine, access tiers, and partner search."
version: "v1"
order: 3
---

# CVT Trust Architecture v1

Blueprint for the **Trust Platform** — how registry facts become a portable Trust Passport, how partners search under consent, and how policy evolves without rewriting history.

**Companion specs:** [TRUST_PROFILE.md](/cvt/docs/trust-profile) (rules, tiers, events), [CVT_VISION.md](/cvt/docs/vision) (platform layers), [REGISTRY_CATEGORIES.md](/cvt/docs/registry-categories) (subjects).

**Status:** Architecture v1 — **Trust Profile v1 implemented** (TP-1–TP-5, TP-4b). Items marked **v1.1+** are the next evolution.

---

## 1. Design principle: facts vs interpretations

The highest-leverage architectural rule:

| Layer | Mutable? | Stores | Examples |
|-------|----------|--------|----------|
| **Facts** | **Append-only** | `trust_events` | `PROFILE_VERIFIED`, `FIRST_AID_CERTIFIED`, `INSURANCE_ACTIVE`, `COMPLAINT_TRUST_VERIFIED`, `CLEAN_STREAK_36M` |
| **Milestones** | **Synced on recompute** | `trust_milestones` | `PLATINUM`, `VERIFIED_5Y`, `CLEAN_24M`, `INSURANCE_60M` — badges, not ops audit |
| **Statements** | **Derived in snapshot** | `passport_json.trustStatements` | `{ code, tone, params }` — rendered in **en/lg** via `messages/*.json` (not SQL strings) |
| **Explanations** | **Versioned, recomputable** | `trust_explanations` | Why standing / level under `trust-v1.0.0` |
| **Interpretation** | **Versioned, recomputable** | `trust_profile_snapshots`, `trust_profile_policies` | Bronze / Silver / Gold / Platinum; Good Standing; Review Required; dormancy-adjusted level |

**Implications**

- History **never changes** — corrections add compensating events (`EVENT_REVERSED`), not silent edits.
- Policies **can evolve** — recompute snapshots under `trust-v1.1.0` without falsifying 2023 milestones.
- Insurers may apply **their own weighting** on exported facts (within contract), separate from CVT’s public level.
- Future **CRB appendix** attaches as new fact sources + partner tier — not a rewrite of conduct events.

```text
Registry (verified records)
        ↓ emit
trust_events (immutable facts + visibility_tier + confidence_level)
        ↓ compute (policy version N)
trust_profile_snapshots (interpretation cache)
        ↓ filter (access tier + consent + partner profile)
Partner / Owner / Public APIs
```

---

## 2. Layer map

```text
┌─────────────────────────────────────────────────────────────────┐
│  Channels: Owner portal · Public passport · Partner portal/API  │
│  Connect (read-only Tier 1 highlights) · Manual legal export    │
└────────────────────────────┬────────────────────────────────────┘
                             │
┌────────────────────────────▼────────────────────────────────────┐
│  Access tier model (§5) + Consent engine (§7)                   │
│  Partner search engine (§8) · Partner risk class (§6)           │
└────────────────────────────┬────────────────────────────────────┘
                             │
┌────────────────────────────▼────────────────────────────────────┐
│  Trust policy engine (§4) — level, standing, dormancy, streaks  │
│  Rehabilitation & sealing (§9)                                  │
└────────────────────────────┬────────────────────────────────────┘
                             │
┌────────────────────────────▼────────────────────────────────────┐
│  Timeline engine (§3) — emit, seal, streak detection          │
│  trust_events (facts)                                           │
└────────────────────────────┬────────────────────────────────────┘
                             │
┌────────────────────────────▼────────────────────────────────────┐
│  Registry layer — riders, future categories, complaints, docs   │
└─────────────────────────────────────────────────────────────────┘
```

---

## 3. Registry layer

**Role:** Source of verified identity, documents, status, complaints (Stage A), plate linkage.

**Emits facts when:** status → `verified`, re-verification, document acceptance, training/insurance staff verification, Stage B trust moderation outcome.

**Does not:** compute trust level, expose conduct to public, or grant partner access.

**Future:** multi-category registrants (`CVT-TAX-*`, `CVT-PRV-*`, …) share the same event pipeline keyed by `verification_id`.

---

## 4. Trust events layer & timeline engine

### 4.1 `trust_events` (facts)

Immutable rows. Each event includes:

| Field | Purpose |
|-------|---------|
| `event_type` | Canonical fact code |
| `occurred_at` | When it happened |
| `payload` | Evidence refs, months, labels |
| `visibility_tier` | Minimum access tier that may use this row |
| `confidence_level` | How the fact was established (§4.2) |
| `is_sealed` | Rehabilitation — hidden from partners |
| `conduct_category` | Hard Search labels only |

### 4.2 Event confidence **(v1.1+)**

Every event carries **`confidence_level`** so consumers (especially insurers) know provenance:

| Level | Meaning | Example |
|-------|---------|---------|
| `verified` | CVT staff verified against evidence | `PROFILE_VERIFIED`, Stage B conduct |
| `partner_verified` | Contracted partner attested + CVT accepted | Training provider cert |
| `partner_insurer` | Insurer API / bordereau under contract | `INSURANCE_ACTIVE` continuity |
| `self_reported` | Registrant supplied; not yet independently verified | Helmet compliance attestation |
| `system_generated` | Derived milestone from other facts | `CLEAN_STREAK_36M`, level achieved |

Policy weights may discount `self_reported` for level while still showing on owner view.

### 4.3 Trust streaks **(v1.1+)**

**Streaks** are long-horizon behavioural incentives (GitHub / airline-status mental model). Emitted as **public-safe** milestone events when thresholds are met (idempotent).

| Event type | Typical threshold | Visibility |
|------------|-------------------|------------|
| `CLEAN_STREAK_12M` | 12 months no trust-affecting conduct | `public` |
| `CLEAN_STREAK_36M` | 36 months clean | `public` |
| `INSURANCE_STREAK_60M` | 60 months continuous cover | `public` |
| `VERIFIED_STREAK_120M` | 10 years verified tenure | `public` |

Timeline **preserves** streak achievements; dormancy (§4.4) may lower **current level** without deleting `PLATINUM_ACHIEVED` in 2025.

### 4.4 Trust level decay (dormancy) **(v1.1+)**

**Problem:** A registrant who was Platinum in 2025 but inactive for 8 years should not present as Platinum today.

**Rule:** Dormancy adjusts **interpretation** (snapshot level / standing), not **history**.

| Registry inactivity (no re-verification, no positive engagement signal) | Effect on snapshot |
|-----------------------------------------------------------------------------|-------------------|
| **2 years** | `Review Required` — level unchanged until review |
| **3 years** | Cap display level at **Silver** (policy may emit `TRUST_LEVEL_CHANGED`) |
| **5 years** | Cap display level at **Bronze** |

**Timeline stays intact:**

```text
2021  PROFILE_VERIFIED
2023  GOLD_ACHIEVED
2025  PLATINUM_ACHIEVED
2026  DORMANCY_REVIEW_REQUIRED   (system_generated)
2026  TRUST_LEVEL_CHANGED       (platinum → silver, reason: dormancy_36m)
```

Re-verification or new positive facts triggers recomputation — streaks and tenure can restore level per policy.

---

## 5. Trust policy engine

**Inputs:** All non-reversed, non-sealed `trust_events` for subject + `trust_profile_policies` version.

**Outputs (snapshot):**

- `trust_level` — bronze | silver | gold | platinum (possibly dormancy-capped)
- `standing` — good | review_required | not_in_good_standing
- `factors[]` — explainable codes for admin / owner
- `policy_version`, `computed_at`

**Jobs**

- On-demand: new event, moderation outcome, suspension lift, consent irrelevant to compute
- Nightly: dormancy scan, streak detection, seal eligibility, clean-period milestones

**Never:** mutate `trust_events`; only emit new rows.

---

## 6. Partner risk class **(v1.1+ direction)**

Replace ad-hoc `partner_type` exceptions with **`partner_risk_class`** on `trust_partners`:

| Class | Typical partners | Default max API tier |
|-------|------------------|----------------------|
| `low` | SACCO | Soft only |
| `medium` | Bank, MFI, employer, logistics | Soft + Enhanced (if profile allows) |
| `high` | **Contracted** insurer, optional vetted fleet | Soft + Enhanced; Hard only if entitled |
| `restricted` | CVT Trust Team, internal ops | Internal + manual legal |

**`partner_type`** remains (employer, logistics, insurer, …) for UX and search category defaults.

**Capability flags** (explicit, auditable):

| Flag | Meaning |
|------|---------|
| `allow_soft_search` | Tier 2 |
| `allow_enhanced_search` | Tier 3 |
| `allow_hard_search` | Tier 4 — **never** default for all insurers |
| `hard_search_contract_ref` | Enterprise contract id |
| `hard_search_expires_at` | Annual review |
| `hard_search_revoked_at` | Immediate kill switch |

**Policy shorthand:** `allow_hard_search` requires `partner_risk_class IN ('high','restricted')` **AND** contract valid **AND** named user **AND** justification on each query.

Optional future: **selected fleet operators** on enterprise fleet contract — same privileged-access bar as insurers, not open to all logistics profiles.

---

## 7. Consent engine

**Purpose-specific consent** (implemented v1): rider grants **employment**, **finance**, or **insurance** — not a named partner org.

| Purpose | Unlocks (if partner profile allows) |
|---------|-------------------------------------|
| `employment` | Soft + Enhanced |
| `finance` | Soft |
| `insurance` | Soft (+ Hard only for entitled insurer + contract) |

**Artifacts:** `trust_profile_consents` — shareable code `XXXX-XXXX-XXXX`, bound to `verification_id`, expiry, revoke.

**Validation pipeline**

1. Partner API key → `trust_partners` profile + risk class
2. Consent token → active row, purpose match, ID match
3. Search category → profile `allowed_search_categories`
4. Resolved tier ≤ profile max tier

---

## 8. Partner search engine

**Entry:** `POST /api/v1/partner/trust-search` (context + category) or tier-specific GETs.

**Writes:** `partner_search_requests` (context jsonb), `trust_profile_access_log` (tier, consent ref, allow/deny).

**Hard Search additions (TP-6):**

- `X-Justification` or `context.justification` (application / policy ref)
- Named `partner_user_id` when partner login ships
- Deny if contract expired or `hard_search_revoked_at` set

**Interim channel:** Partner web portal (`/partner`) — same engine, no HRIS integration.

---

## 9. Access tier model

Renumbered for **owner-first** transparency:

| Tier | Name | Audience | Auth |
|------|------|----------|------|
| **0** | **Owner view** | Registrant (signed-in or verified mobile) | Account / OTP match |
| **1** | **Public passport** | Anyone | None |
| **2** | **Soft search** | Consent-based partners | API key + consent |
| **3** | **Enhanced search** | Employment assessment partners | API key + employment consent |
| **4** | **Hard search** | **Privileged** — contracted insurers (+ optional vetted fleet), Trust Team | Contract + justification + audit |
| **—** | **Legal disclosure** | LE / courts | Manual workflow |
| **—** | **Internal ops** | CVT staff RBAC | Admin |

### Tier 0 — Owner view **(v1.1+)**

Registrants see **their own** full trust story:

- Full timeline including conduct **categories**, dates, suspension history
- Moderation outcomes (Stage B states, not raw complainant PII)
- Dispute / correction entry points
- Sealed events: “record sealed” indicator, not hidden from owner (policy TBD)

**Rationale:** Transparency builds trust in the platform; public and partner tiers stay progressively narrower.

### Tier 4 — Hard search (privileged access)

**Not** “every insurer.” Eligibility:

| Requirement | Notes |
|-------------|-------|
| Enterprise contract | `hard_search_contract_ref`, signed DPA |
| Named users | Per-user audit when partner auth exists |
| Per-search justification | Logged; no bulk fishing |
| Audit trail | `trust_profile_access_log` + request row |
| Annual review | `hard_search_expires_at`; ops renewal |
| Revocation | `hard_search_revoked_at` — instant |

**Eligible actors (default policy):**

- CVT Internal Trust Team (`restricted`)
- **Contracted insurers** individually entitled (`high` + flags)
- **Optional:** selected fleet operators under enterprise agreement — explicit opt-in, not all logistics

**Never Hard Search:** employers (standard), SACCOs, stage leaders, public, other riders.

---

## 10. Rehabilitation & sealing framework

**Agreed policy (v1 direction):**

- **5 years** elapsed since moderate conduct event
- **Clean recovery** — no repeat trust-affecting events in window
- **Moderate severity only** — severe events may follow stricter rules (open policy)
- Event remains in `trust_events` with `is_sealed = true`
- Excluded from Tiers 2–4; owner and internal see seal status
- Emit `RECORD_SEALED`

Permanent punishment is **anti-goal** — mirrors rehabilitation law and keeps the system socially acceptable.

---

## 11. API architecture (summary)

| Route | Tier | Status |
|-------|------|--------|
| `GET /api/v1/passport/{id}` | 1 | Implemented |
| Owner portal APIs | 0 | **v1.1+** |
| `GET /api/v1/partner/trust-summary/{id}` | 2 | Implemented |
| `GET /api/v1/partner/employment-summary/{id}` | 3 | Implemented |
| `POST /api/v1/partner/trust-search` | 2–3 (resolved) | Implemented |
| `GET /api/v1/restricted/conduct-history/{id}` | 4 | TP-6 |
| Manual legal export | — | TP-8 |

Connect reads **Tier 1** highlights only.

---

## 12. Future CRB layer (v5+)

Separate legal programme — not part of Trust Architecture v1 execution.

- New `data_source = crb` events
- Distinct consent copy and retention
- Does not rename CVT level as “credit score”
- Partners may combine CVT facts + bureau appendix in **their** models

---

## 13. Implementation roadmap (architecture → phases)

| Item | Phase | Notes |
|------|-------|-------|
| Facts / snapshots split | v1 | **Done** — document formally here |
| Tier 0 owner view | v1.1 | Rider portal UX |
| `confidence_level` on events | v1.1 | Migration + emit paths |
| Trust streaks + dormancy | v1.1 | Policy + nightly job |
| `partner_risk_class` + Hard Search gates | **Done** (`20260612120000`) | TP-6 API still pending |
| Hard Search API | TP-6 | **Done** (`get_trust_restricted_conduct_history`, `/api/v1/restricted/conduct-history`) |
| Sealed records job | TP-7 | |
| Legal disclosure workflow | TP-8 | |
| CRB | v5+ | |

---

## 14. Vision: portable trust beyond boda

The platform pattern supports any registrant category that completes CVT verification:

```text
riders → taxis → commercial → private owners → (future) artisans, gig workers, traders
```

Same stack: **Registry → Events → Policy → Passport → Consent-gated partner search.**

Positioning: verified fact history + interpretable standing — **not** a credit score, safety guarantee, or social rating feed.

---

## Document map

| Doc | Role |
|-----|------|
| **This file** | Architecture blueprint |
| [TRUST_PROFILE.md](/cvt/docs/trust-profile) | Product rules, tier behaviour, event catalogue |
| [APP_CHANGELOG.md](./APP_CHANGELOG.md) | What shipped when |

---

## Document history

- **2026-05-29** — Initial Trust Architecture v1 from Trust Profile review: tier 0 owner view, privileged Hard Search, `partner_risk_class`, dormancy, streaks, `confidence_level`, facts vs interpretations.
