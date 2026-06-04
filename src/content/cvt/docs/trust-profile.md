---
title: "Trust Profile"
description: "Trust Timeline, trust level, moderation, and partner tiers."
version: "v1"
order: 2
---

# CVT Trust Profile — Specification (draft)

The **CVT Trust Profile** is a **versioned, human-readable trust passport** built from verified registry facts, training and insurance signals, and **two-stage moderated** complaint outcomes. It is designed for partners (insurers, employers, logistics firms) and, with consent, registrants.

**Primary presentation:** three linked surfaces for the **public** layer, with deeper conduct detail unlocked by consent and authorisation (see §3).

```text
Trust Profile   (current snapshot — who you are now)
      +
Trust Timeline  (trust_events — how you got here; positives only in public)
      +
Trust Level     (Bronze → Platinum — where you stand today)
      =
Trust Passport  (public bundle + Good Standing)
```

Partner views add **Soft Search**, **Enhanced Search**, and **Hard Search** on the same underlying data — each gated by consent, **partner risk class**, and privileged-access rules (see §3).

**Status:** Trust Profile **v1 implemented** (TP-1–TP-5, TP-4b). Policy items marked **v1.1+** are the next evolution.

**Architecture blueprint:** [TRUST_ARCHITECTURE_V1.md](/cvt/docs/trust-architecture-v1) — facts vs interpretations, engines, tiers, partner risk class, dormancy, streaks.

See [CVT_VISION.md](/cvt/docs/vision) for platform context.

---

## 1. Purpose

- Show **what CVT has verified** about a person and their registration(s) in plain language.
- Preserve an **append-only trust history** — the story of verification, training, insurance, and conduct over years.
- Expose data through **layered visibility** — public surfaces stay positive; conduct detail only with consent and authorisation.
- **Reward good behaviour** in v1 — positive signals dominate.
- Apply **light, delayed penalties** only after rigorous complaint moderation.
- Support **insurance** (especially private non-commercial) before any credit data.

**CVT Trust Profile is not:**

- A credit bureau score or lending decision
- Proof of driving skill or trip safety
- An insurance quote or approval
- Based on raw accusations, rumours, anonymous tips, or complaints still under investigation

---

## 2. Three-part presentation

### 2.1 Trust Profile (snapshot — “now”)

Current-state summary derived from registry + latest policy compute. Shown at top of passport UI and partner API.

```text
Trust Profile — CTV-RDR-2026-000042

Verified since:     2021
Years active:       5
Documents:          Current
Re-verification:    Up to date
Insurance:          Active (continuous 18 months)
Training:           Road safety · First aid
SACCO / stage:      Ntinda · Example SACCO

Policy:             trust-v1.0.0
Profile updated:    2026-06-03
```

Conduct is **not** listed here on the public layer — only **Good Standing** on the passport (§2.4). Partners see aggregates or detail via §3.

Stored in **`trust_profile_snapshots`** (materialised periodically or on-demand). Snapshots are **derived**; they are not the source of truth.

**Facts vs interpretations** (see [TRUST_ARCHITECTURE_V1.md](/cvt/docs/trust-architecture-v1) §1):

- **Facts** — append-only **`trust_events`** (what happened, when, with what confidence).
- **Interpretations** — versioned **`trust_profile_policies`** + snapshots (level, standing, dormancy caps). Policy changes recompute forward; history stays intact.

### 2.2 Trust Timeline (history — “journey”) ★ crown jewel

An **append-only event log** — **`trust_events`** — records every trust-relevant milestone as it happens. On the **public Trust Timeline**, only **positive** events are shown (see §3).

```text
Trust Timeline — CTV-RDR-2026-000042

2021   PROFILE_VERIFIED
2022   REVERIFICATION_COMPLETE
2023   ROAD_SAFETY_CERTIFIED
2024   FIRST_AID_CERTIFIED
2024   INSURANCE_ACTIVE
2025   CLEAN_PERIOD_24M
2026   PLATINUM_ACHIEVED
```

**Why it matters**

- Insurers see **continuity** (insurance, clean periods), not just a point-in-time badge.
- Employers and logistics firms see **training progression**.
- Registrants see a **reputation they build over time** — incentive to stay verified and upskill.
- Disputes are auditable: events link to evidence (`rider_id`, `document_id`, `complaint_id`, moderator).

**Rules**

- **Append-only** — never delete; corrections add a compensating event (e.g. `EVENT_REVERSED` + reason), not silent edits.
- Only **verified** events enter the log (same bar as passport factors).
- **Public timeline:** positive milestones only — no conduct negatives, suspensions, or complaint events.
- Conduct and suspension events are stored for partner tiers after Stage B moderation (§6); **sealed** events follow §3.7.
- Milestone events like `GOLD_ACHIEVED` / `PLATINUM_ACHIEVED` are emitted when trust level **crosses upward**; downward moves emit `TRUST_LEVEL_CHANGED` internally — public passport reflects level via **Trust Level**, not a shame ledger.

See §4 for schema; §3 for who sees what.

### 2.3 Trust Level (band — “standing”)

Single band reflecting **current** standing, derived from profile + policy:

| Level | Typical meaning |
|-------|-----------------|
| **Bronze** | Newly verified; minimum data |
| **Silver** | Established tenure + complete documents |
| **Gold** | Strong positives (training, insurance, clean conduct record) |
| **Platinum** | Long tenure + multiple training/insurance signals + no trust-affecting negatives |

Level changes emit **`trust_events`** (`SILVER_ACHIEVED`, `GOLD_ACHIEVED`, `PLATINUM_ACHIEVED`, or `TRUST_LEVEL_CHANGED`).

Exact thresholds live in **`trust_profile_policies`** (versioned config).

#### 2.3.1 Trust level decay (dormancy) **(v1.1+)**

A registrant who earned **Platinum** years ago but has been **inactive** should not display Platinum forever. Dormancy adjusts **interpretation** (snapshot), not **history**.

| Inactivity (no re-verification / engagement per policy) | Snapshot effect |
|--------------------------------------------------------|-----------------|
| **2 years** | `Review Required` |
| **3 years** | Cap displayed level at **Silver** |
| **5 years** | Cap displayed level at **Bronze** |

Timeline **unchanged** — e.g. `2025 PLATINUM_ACHIEVED` remains; current passport may show **Silver · Review Required**. Re-verification restores upward recompute. See [TRUST_ARCHITECTURE_V1.md](/cvt/docs/trust-architecture-v1) §4.4.

#### 2.3.2 Trust streaks **(v1.1+)**

Long-horizon **streak** milestones — public-safe, behavioural incentives (comparable to tenure programs / contribution streaks):

| Event type | Example threshold |
|------------|-------------------|
| `CLEAN_STREAK_12M` | 12 months without trust-affecting conduct |
| `CLEAN_STREAK_36M` | 36 months clean |
| `INSURANCE_STREAK_60M` | 60 months continuous insurance |
| `VERIFIED_STREAK_120M` | 10 years verified |

Emitted once (idempotent); visible on Tier 0–1 timeline. Distinct from point-in-time `CLEAN_PERIOD_24M` rewards in §4.2.

### 2.4 Trust Passport (public bundle)

The **Trust Passport** is what registrants and the public see — not a separate data store, but the composed **public layer**:

```text
Trust Passport — CTV-RDR-2026-000042

Trust Level:        Platinum
Standing:           Good Standing

[Trust Profile fields — documents, insurance, training, tenure …]

Trust Timeline (positive milestones only)
2021   PROFILE_VERIFIED
2022   REVERIFICATION_COMPLETE
…
```

**Good Standing** — derived summary, not a narrative:

| Standing | Typical meaning (v1 draft) |
|----------|----------------------------|
| **Good Standing** | Verified, not suspended, no active severe trust factor |
| **Review Required** | Re-verification overdue, insurance lapse, or light trust factor active |
| **Not in Good Standing** | Active suspension or severe trust-affecting conduct (no detail on public passport) |

Public passport shows **standing only** for conduct — not counts, severity, or complaint text. Partners unlock more via §3.

### 2.5 Combined public view (UI)

```text
┌─────────────────────────────────────┐
│  Trust Level: Platinum              │
│  Standing: Good Standing            │
├─────────────────────────────────────┤
│  Trust highlights (statements)      │
│  ✓ Verified member since 2021       │
│  ✓ Insurance continuous 18 months   │
│  ✓ Road safety + First aid training │
│  ✓ No trust-affecting conduct (24m)  │
│  ✓ Achieved Platinum status in 2026 │
├─────────────────────────────────────┤
│  Trust Profile (current)            │
│  Documents: Current · Insurance: …  │
├─────────────────────────────────────┤
│  Trust Timeline (event codes)       │
│  2021 PROFILE_VERIFIED              │
│  2022 REVERIFICATION_COMPLETE       │
│  …                                  │
└─────────────────────────────────────┘
```

Partners and riders read **highlights** first; the **timeline** remains the auditable fact log for those who want the journey.

### 2.6 Derived layers (statements, milestones, explanations)

Operational data and human-facing copy are **separated on purpose**. Raw `trust_events` stay for audit; derived layers make passports and partner responses understandable.

```text
trust_events (immutable facts — audit)
      ↓ recompute
trust_milestones (achievement badges — synced table)
trust_profile_snapshots.passport_json.trustStatements (highlights — snapshot cache)
trust_explanations (why standing / level — policy-versioned table)
```

| Layer | Store | Audience | Purpose |
|-------|--------|----------|---------|
| **Events** | `trust_events` | Ops, auditors, Tier 0+ | What happened, when (`ROAD_SAFETY_CERTIFIED`, `COMPLAINT_TRUST_VERIFIED`, …) |
| **Milestones** | `trust_milestones` | UI badges, owner portal (future) | Achievements distinct from ops events (`PLATINUM`, `CLEAN_24M`, `VERIFIED_5Y`, …) |
| **Statements** | `passport_json.trustStatements` | Public passport, partners (target) | Plain-language **Trust highlights** |
| **Explanations** | `trust_explanations` | Owner portal, staff, disputes (target) | Why **standing** and **trust level** under `policy_version` |

#### 2.6.1 Trust statements (Trust highlights) — **implemented v1**

**Design:** Do not ask employers or riders to read event codes. On each recompute, derive a short list of positive (or neutral/caution) bullets from events + policy inputs.

**Target copy (example):**

```text
Trust highlights

✓ Verified member since 2021
✓ Maintained uninterrupted insurance for 18 months
✓ Completed Road Safety and First Aid training
✓ No trust-affecting conduct events in the last 24 months
✓ Achieved Platinum status in 2026
```

**Storage:** `trust_profile_snapshots.passport_json.trustStatements` — array of `{ code, tone, params }` (not locale-specific prose in SQL).

| `code` | Typical `params` | Source facts |
|--------|------------------|--------------|
| `VERIFIED_MEMBER` | `year` | `verified_at` / tenure |
| `INSURANCE_CONTINUITY` | `count` (months) | active `rider_insurance_records` |
| `INSURANCE_ACTIVE` | — | insurance verified active |
| `TRAINING_COMPLETED` | `certTypes[]` | verified certifications |
| `CLEAN_CONDUCT_24M` | — | no Stage B conduct in 24m |
| `LEVEL_ACHIEVED` | `level`, `year` | `*_ACHIEVED` event or current level |
| `STANDING_REVIEW` / `STANDING_NOT_GOOD` | — | standing compute |

**Functions:** `trust_build_statements()` → called from `trust_recompute_snapshot()`.

**Localisation:** English and Luganda via `messages/*/trustPassport.statement.*` and `src/lib/trust-statements.ts` on passport UI — **not** embedded in Postgres strings.

**API:** `GET /api/v1/passport/{id}` returns `trustStatements`. Partner Soft/Enhanced/search responses expose the same highlights as `passport.trust_statements` (`code`, `tone`, `params`).

#### 2.6.2 Trust milestones — **implemented v1 (table + sync)**

**Design:** Badges such as `PLATINUM`, `VERIFIED_5Y`, `CLEAN_24M`, `INSURANCE_60M` are **achievements**, not operational audit rows. A dedicated table keeps UI and queries simple without overloading `trust_events`.

**Table `trust_milestones`:**

| Column | Notes |
|--------|--------|
| `subject_id` | `riders.id` |
| `verification_id` | denormalised |
| `milestone_code` | e.g. `PLATINUM`, `GOLD`, `CLEAN_24M`, `VERIFIED_5Y`, `INSURANCE_60M` |
| `achieved_at` | when first earned / last reaffirmed on recompute |
| `metadata` | optional jsonb |

Unique on `(subject_id, milestone_code)`.

**Sync:** `trust_sync_milestones()` on each `trust_recompute_snapshot()` — does **not** replace timeline events; complements them for badge UI and future owner dashboard.

**Rule:** Level-crossing events (`PLATINUM_ACHIEVED`) may still exist in `trust_events` for the public timeline; `trust_milestones` holds the **current achievement record** for “has ever reached Platinum” style UX.

#### 2.6.3 Trust explanation engine — **implemented v1 (data); UI pending**

**Design:** Standing and trust level need a **why**, not only a label. Explanations are policy-versioned so CVT can change weights without rewriting history.

**Table `trust_explanations`:**

| Column | Notes |
|--------|--------|
| `subject_id` | registrant |
| `explanation_code` | `STANDING` \| `TRUST_LEVEL` (extend for factors later) |
| `message` | human-readable rationale (staff/owner; i18n TODO) |
| `policy_version` | e.g. `trust-v1.0.0` |
| `factor_codes` | `text[]` — e.g. `INSURANCE_ACTIVE`, `COMPLAINT_REPEAT_UPHELD` |
| `computed_at` | last recompute |

Unique on `(subject_id, explanation_code, policy_version)`.

**Sync:** `trust_sync_explanations()` on recompute — derives messages from standing, level caps, conduct counts, insurance, re-verification.

**Visibility (target):**

| Tier | Explanations |
|------|----------------|
| **Tier 0 Owner** | Full `STANDING` + `TRUST_LEVEL` + factor codes; dispute entry |
| **Tier 1 Public** | Highlights only — no factor-level explanation |
| **Partners** | Aggregates in Soft/Enhanced; not full explanation engine in v1 |
| **Staff admin** | Read explanations on rider trust tab |

**Next:** Owner portal panel; move explanation copy to `code` + `params` + messages (same pattern as statements); optional `GET` RPC for registrant self-service.

### 2.7 Snapshot storage (implementation target)

**`trust_profile_snapshots`** (derived, cache):

- `passport_json` — Trust Profile fields + **`trustStatements`** (§2.6.1) + standing indicator in snapshot columns
- `trust_level` — `bronze` \| `silver` \| `gold` \| `platinum`
- `trust_index` — optional internal integer for APIs/sorting only
- `policy_version` — e.g. `trust-v1.0.0`
- `computed_at`
- `factors[]` — `{ code, label, impact, evidence_ref, data_source }`
- `last_event_id` — pointer to latest `trust_events` row included in compute
- `subject_person_id` / `subject_nin_hash` — internal (never expose raw NIN publicly)

**`trust_events`** (source of truth for history) — see §4.

---

## 3. Access tiers & visibility

**Seven surfaces** on the same facts: Owner → Public → partner tiers → manual legal → internal ops. Same **`trust_events`** and snapshots; filtering, aggregation, **partner risk class**, and consent determine release.

### 3.1 Tier overview

| Tier | Name | Audience | Auth | Show negatives? |
|------|------|----------|------|-----------------|
| **0** | **Owner view** | Registrant (own record) | Account / verified mobile match | **Full own history** — conduct categories, dates, suspensions, moderation outcomes, dispute entry (**v1.1+**) |
| **1** | **Public Passport** | Anyone | None | **No** — standing indicator only; positive timeline |
| **2** | **Soft Search** | Consent-based partners | API key + consent token | **Aggregates only** — no categories, narratives, or dates |
| **3** | **Enhanced Search** | Employment assessment partners | API key + employment consent | **Counts + severity + recovery** — still no descriptions or identities |
| **4** | **Hard Search** | **Privileged** — contracted insurers (+ optional vetted fleet), Trust Team | Enterprise contract + named users + per-search justification + audit + annual review; revocable | **Category + severity + month + status** — never complainant/evidence |
| **—** | **Legal disclosure** | Law enforcement, courts | **Manual only** — MOU, court order, formal request | Case-limited; full audit |
| **—** | **Internal ops** | CVT Trust Team | Internal RBAC | **Everything** — moderation, disputes, sealed records |

### 3.2 Tier 0 — Owner view **(v1.1+)**

The registrant is the **first** audience for transparency — not an afterthought.

**Visible (own registration / person rollup with consent)**

- Full **Trust Timeline** including conduct milestones (categories, dates, status)
- Suspension history and reactivation
- Stage B moderation outcomes (not complainant identity or evidence files unless policy allows dispute flow)
- Current level, standing, dormancy / review flags
- Sealed record indicators (“sealed after rehabilitation”) — owner sees that a record exists; partners do not

**Purpose:** Build trust *in CVT* by showing the same facts CVT uses, with a path to dispute (`EVENT_REVERSED`, Trust Team review).

**Implementation:** Rider Connect app or registrant portal — separate from `/passport/{id}` (Tier 1). See [TRUST_ARCHITECTURE_V1.md](/cvt/docs/trust-architecture-v1) §5.

### 3.3 Tier 1 — Public Passport

**Audience:** Anyone. **Access:** no login required.

**Visible**

- Trust level
- Verification status
- Positive timeline (training achievements, insurance milestones, clean periods, level achievements)
- Insurance status (high-level — active / lapsed, not policy numbers)
- Good standing indicator

**Never visible**

- Complaint details
- Suspension reasons
- Investigation history
- Moderator notes
- Conduct counts or severity

### 3.4 Tier 2 — Consent-Based Partner Search (Soft Search)

**Audience:** Insurers, banks, MFIs, employers, logistics companies, fleet operators, SACCOs (with consent).

**Requirement:** explicit **purpose-specific** registrant consent (§11).

Example consent text:

> “I consent to XYZ Logistics viewing my CVT Trust Passport for **employment purposes**.”

**Visible (aggregates only)**

```text
Trust level:              Gold
Current standing:         Good
Trust-affecting events:   1 (resolved)
Months since last event:  36
Active suspension:        No
Highest severity:         Moderate
```

**Never in Soft Search:** categories, narratives, dates, complaint IDs, complainant identity, witness statements, moderator notes.

**SACCOs:** Soft Search only with consent — **never** Enhanced or Hard (politics, rivalries, retaliation risk).

### 3.5 Tier 3 — Enhanced Search (employment tier)

**Audience:** Employers and logistics firms — **not** full Hard Search.

Employers must **not** see harassment allegations, violence categories, or old dispute detail. Enhanced sits between Soft and Hard.

**Visible**

```text
Current standing:         Good
Active suspension:        No
Verified trust events:    2
Highest severity:         Moderate
Recovery period:          24 months clean
```

**Still never visible:** complaint descriptions, witness statements, complainant identity, moderator notes, conduct **categories** (those are Hard Search / insurer-only).

**Who gets Enhanced**

| Party | Soft | Enhanced | Hard |
|-------|------|----------|------|
| Employers | ✓ | ✓ | ✗ |
| Logistics / fleet operators | ✓ | ✓ | ✗ |
| Insurers (contracted / entitled only) | ✓ | ✓ | ✓* |
| Banks / MFIs | ✓ | ✗ | ✗ |
| SACCOs | ✓ (consent) | ✗ | ✗ |
| Stage leaders | ✗ | ✗ | ✗ |
| General public | ✓ (Tier 1 only) | ✗ | ✗ |

### 3.5 Tier 4 — Hard Search (privileged access)

**Not** “all insurers.” Hard Search is **privileged access** — same rigour as elevated data-room access in enterprise systems.

#### Who may receive Hard Search (default policy)

| Actor | Eligibility |
|-------|-------------|
| **CVT Internal Trust Team** | Always (`partner_risk_class = restricted`) |
| **Insurers** | **Only when individually entitled** — enterprise contract, not `partner_type = insurer` alone |
| **Selected fleet operators** | **Optional** — large enterprise fleet agreements only; explicit CVT opt-in |
| **Employers, SACCOs, banks, public** | **Never** self-service Hard Search |

#### Hard Search requirements (all entitled partners)

| Requirement | Purpose |
|-------------|---------|
| **Enterprise contract** | `hard_search_contract_ref` on `trust_partners` |
| **Named users** | Per-user identity on each query when partner auth exists |
| **Search justification** | `X-Justification` / logged application or policy ref — no bulk fishing |
| **Audit trail** | `trust_profile_access_log` + `partner_search_requests` |
| **Annual review** | `hard_search_expires_at` — renewal or lapse |
| **Revocation** | `hard_search_revoked_at` — immediate kill switch |

#### Payload (even for entitled insurers)

Underwriting support only — expose **only**:

```text
Category:   Dangerous driving
Severity:   Moderate
Date:       March 2024
Status:     Resolved
```

**Never expose:** complainant identity, phone numbers, evidence files, witness statements. Sealed records **excluded** (§3.7).

Consent still required where applicable; contract is **additional**, not a substitute.

### 3.6 Law enforcement & courts — manual legal disclosure

**Never** direct self-service access.

```text
Law enforcement / court request
        ↓
Audit log (law_enforcement_access_log)
        ↓
Case reference required
        ↓
Limited disclosure (case-scoped)
```

Every access generates **`law_enforcement_access_log`**:

- officer ID
- organisation
- reason
- case number
- timestamp
- disclosure scope

**Law enforcement:** MOU or formal legal request only. **Courts:** lawful process only. **No registrant consent** where disclosure is legally mandated (§11).

### 3.7 Sealed records (rehabilitation)

After policy thresholds — e.g. **5 years** elapsed, **no repeat** events, **clean recovery** — certain **moderate** conduct events may become **sealed**.

| Sealed record visible to | Hidden from |
|--------------------------|-------------|
| Registrant (Tier 0) | Indicators only — “sealed after rehabilitation” |
| CVT Trust Team | Entitled insurers (Hard Search) |
| Courts / lawful requests | Employers |
| | Soft / Enhanced partners |
| | Public (Tier 1) |

**Agreed policy direction:** **5 years** + **clean recovery** + **moderate events only** (severe events may follow stricter rules — open). Permanent punishment destroys trust systems; rehabilitation is a product principle, not an afterthought.

Sealed events remain in **`trust_events`** with `is_sealed = true`; partner APIs and Hard Search **exclude** them unless lawful disclosure applies.

### 3.8 Party access matrix (summary)

| Party | Public | Soft Search | Enhanced | Hard Search |
|-------|--------|-------------|----------|-------------|
| General public | ✓ | ✗ | ✗ | ✗ |
| Employers | ✗ | ✓ | ✓ | ✗ |
| Logistics / fleet | ✗ | ✓ | ✓ | ✗ |
| Banks / MFIs | ✗ | ✓ | ✗ | ✗ |
| Insurers (entitled only\*) | ✗ | ✓ | ✓ | ✓ |
| SACCOs | ✗ | ✓ (consent) | ✗ | ✗ |
| Stage leaders | ✗ | ✗ | ✗ | ✗ |
| Registrant (owner) | ✓ (Tier 0) | — | — | — |
| Law enforcement | ✗ | ✗ | ✗ | Manual only |
| Courts | ✗ | ✗ | ✗ | Manual only |
| CVT Trust Team | Internal | Internal | Internal | Full |

\*Hard Search requires contract + flags — see §3.5 and §14.2 `partner_risk_class`.

### 3.9 Partner risk class **(v1.1+ direction)**

Prefer **`partner_risk_class`** over endless `partner_type` exceptions for capability rules:

| `partner_risk_class` | Example partners | Default max tier |
|----------------------|------------------|------------------|
| `low` | SACCO | Soft (2) |
| `medium` | Bank, employer, logistics | Soft + Enhanced if profile allows |
| `high` | Contracted insurer, optional vetted fleet | Soft + Enhanced; Hard **only if entitled** |
| `restricted` | CVT Trust Team | Internal + manual legal |

`partner_type` (employer, logistics, insurer, …) remains for UX and default search categories. Policy shorthand: `allow_hard_search ⇔ risk_class ∈ {high, restricted} ∧ contract_valid ∧ ¬revoked`. See [TRUST_ARCHITECTURE_V1.md](/cvt/docs/trust-architecture-v1) §6.

### 3.10 Event visibility (schema)

Each `trust_events` row carries **`visibility_tier`** and optional **seal** state:

| Tier / flag | Used for |
|-------------|----------|
| `owner` | Tier 0 full registrant view (**v1.1+**) |
| `public` | Tier 1 timeline |
| `standing_only` | Drives Good Standing; not listed on public timeline |
| `partner_soft` | Contributes to Soft Search aggregates only |
| `partner_enhanced` | Counts toward Enhanced metrics (not row detail) |
| `partner_hard` | Insurer Hard Search row (category, severity, month, status) |
| `sealed` | Excluded from all partner tiers; CVT + lawful disclosure only |
| `internal` | Ops notes, investigation in progress |

Columns: `is_sealed`, `sealed_at`, `sealed_reason` (policy ref).

### 3.11 Design principles

1. **Owner transparency first** — registrants see their own full story (Tier 0); public stays positive-dominant.
2. **Progressive disclosure** — aggregates before categories; categories before any narrative (narratives never leave CVT).
3. **Purpose-specific consent** — insurance ≠ employment ≠ finance (§11).
4. **Risk class + profile enforcement** — API rejects tiers above partner capability; Hard Search is never automatic for all insurers.
5. **Privileged Hard Search** — contract, justification, named users, annual review, revocation (§3.5).
6. **Audit everything** — `trust_profile_access_log` (partner APIs); `law_enforcement_access_log` (manual legal).
7. **Conduct enters only after Stage B** — no tier exposes uninvestigated or anonymous complaints.
8. **Rehabilitation by design** — sealed records after clean recovery (§3.7).
9. **Facts immutable, policy versioned** — events never rewritten; levels recomputed under new policy (§2.1).

---

## 4. Trust events (`trust_events`) — schema direction

Immutable **trust history** table. One row per trust-relevant occurrence.

### 4.1 Core columns (draft)

| Column | Type | Notes |
|--------|------|-------|
| `id` | uuid | PK |
| `subject_type` | text | `registration` \| `person` |
| `subject_id` | uuid | `rider_id` / future `registrant_id`, or person key |
| `verification_id` | text | Denormalised `CTV-*` for partner queries |
| `event_type` | text | Enum-like — see §3.2 |
| `occurred_at` | timestamptz | When the milestone happened (not insert time, if different) |
| `recorded_at` | timestamptz | When CVT recorded it |
| `policy_version` | text | Policy in effect when emitted |
| `payload` | jsonb | Evidence refs, labels, previous/new level, locale strings |
| `source` | text | `system` \| `staff` \| `partner_insurer` \| `training_provider` |
| `confidence_level` | text | **v1.1+** — `verified` \| `partner_verified` \| `partner_insurer` \| `self_reported` \| `system_generated` |
| `actor_id` | uuid | Staff or system; null for automated |
| `reverses_event_id` | uuid | If this compensates a prior event |
| `visibility_tier` | text | `public` \| `standing_only` \| `partner_soft` \| `partner_enhanced` \| `partner_hard` \| `sealed` \| `internal` — see §3.9 |
| `is_sealed` | boolean | Default false; when true, excluded from partner tiers |
| `sealed_at` | timestamptz | When seal applied |
| `sealed_reason` | text | Policy ref / trust team note |
| `conduct_category` | text | Hard Search only — e.g. `dangerous_driving` (never public) |

**Indexes:** `(subject_id, occurred_at)`, `(verification_id, occurred_at)`, `(event_type)`.

### 4.2 Event types (v1 catalogue)

**Verification & registry**

| `event_type` | When emitted |
|--------------|--------------|
| `PROFILE_VERIFIED` | First transition to `verified` |
| `REVERIFICATION_COMPLETE` | Re-verification / expiry renewal |
| `DOCUMENTS_COMPLETE` | Required doc set accepted |
| `PROFILE_SUSPENDED` | Suspension started |
| `PROFILE_REACTIVATED` | Suspension cleared |

**Training & compliance**

| `event_type` | When emitted |
|--------------|--------------|
| `TRAINING_COMPLETED` | Generic training logged + verified |
| `ROAD_SAFETY_CERTIFIED` | Road safety cert verified |
| `FIRST_AID_CERTIFIED` | First aid cert verified |
| `DEFENSIVE_RIDING_CERTIFIED` | Defensive riding cert verified |
| `HELMET_COMPLIANCE_VERIFIED` | Helmet compliance checked |

**Insurance**

| `event_type` | When emitted |
|--------------|--------------|
| `INSURANCE_ACTIVE` | Cover verified active |
| `INSURANCE_CONTINUITY_MILESTONE` | e.g. 12m / 24m unbroken (payload: months) |
| `INSURANCE_LAPSED` | Cover ended (neutral/informational; partner-weighted) |

**Conduct (Stage B only)** — never `public`; Soft = aggregates; Enhanced = counts; Hard = category + severity + month + status

| `event_type` | When emitted |
|--------------|--------------|
| `COMPLAINT_TRUST_VERIFIED` | Stage B = Verified |
| `COMPLAINT_TRUST_SEVERE` | Stage B = Severe |
| `COMPLAINT_TRUST_DISMISSED` | Optional — only if correcting a prior trust event via reversal |

**Rewards**

| `event_type` | When emitted |
|--------------|--------------|
| `CLEAN_PERIOD_12M` | 12 months no trust-affecting complaints |
| `CLEAN_PERIOD_24M` | 24 months |
| `CLEAN_STREAK_36M` | **v1.1+** — 36-month clean streak milestone |
| `INSURANCE_STREAK_60M` | **v1.1+** — continuous insurance streak |
| `VERIFIED_STREAK_120M` | **v1.1+** — long verified tenure streak |
| `DORMANCY_REVIEW_REQUIRED` | **v1.1+** — inactivity threshold crossed |
| `SACCO_AFFILIATION_VERIFIED` | SACCO on record |
| `STAGE_AFFILIATION_VERIFIED` | Stage on record |

**Trust level**

| `event_type` | When emitted |
|--------------|--------------|
| `BRONZE_ACHIEVED` | Initial level assigned |
| `SILVER_ACHIEVED` | Upward crossing |
| `GOLD_ACHIEVED` | Upward crossing |
| `PLATINUM_ACHIEVED` | Upward crossing |
| `TRUST_LEVEL_CHANGED` | Any level change (payload: from, to, reason) |

**Integrity**

| `event_type` | When emitted |
|--------------|--------------|
| `FRAUD_CONFIRMED` | Ops-confirmed fraud |
| `EVENT_REVERSED` | Compensating entry; links `reverses_event_id` |
| `RECORD_SEALED` | Moderate event sealed after rehabilitation policy met |

### 4.3 Emission rules

1. **Registry hooks** — e.g. `transition_rider_status` → `verified` emits `PROFILE_VERIFIED`.
2. **Document/training/insurance queues** — staff or partner verify → emit typed event.
3. **Trust compute job** — clean-period and level milestones detected → emit once (idempotent key in payload to prevent duplicates).
4. **Stage B moderation** — emit conduct events only after moderator confirms; assign `conduct_category` for Hard Search tier.
5. **Seal job** — nightly check for rehabilitation eligibility → set `is_sealed`, emit `RECORD_SEALED`.

Backfill: one-time job from `verification_events`, `audit_logs`, and verified dates → seed historical `trust_events` where evidence exists.

---

## 5. Subject

| Level | Description |
|-------|-------------|
| **Person** | Normalised NIN — aggregates across categories |
| **Registration** | One verified record + verification ID |
| **Vehicle** | Plate-normalised |

Default: **registration-level** timeline keyed by verification ID; optional **person-level** rollup timeline when consent allows (merge events across categories for same NIN).

---

## 6. Complaint moderation — two stages before trust impact

**This is the highest-risk area.** Trust must never react to intake noise.

### Stage A — Operational workflow (existing / extended)

Complaint intake, investigation, ops notes — unchanged in spirit (`new`, `under_review`, etc.).

### Stage B — Trust eligibility (required before any negative factor)

A complaint affects the Trust Profile **only** after **trust moderation** completes:

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

### Never affect trust

- Raw accusations not yet through Stage B
- Rumours or unverified third-party reports
- **Anonymous** complaints (unless identity verified to CVT standard — default: **exclude**)
- Single complaints (v1: require **repeat** upheld pattern for meaningful penalty — see §8)
- Complaints linked only to `unverified_plate_id` with no verified subject

Audit: every trust-affecting factor and **`trust_events` row** must reference evidence (`complaint_id`, document id, etc.) + moderator id + timestamp.

---

## 7. Signal matrix — v1 overwhelmingly positive

**Design principle:** v1 **rewards** verified good behaviour. Penalties are **light** and **late**.

### 7.1 Positive signals

| Factor code | Signal | Notes |
|-------------|--------|-------|
| `TENURE_VERIFIED` | Time since first verified | Core positive |
| `REVERIFICATION_CURRENT` | Re-verification / expiry current | Strong positive |
| `DOCS_COMPLETE` | Required documents accepted | Core |
| `ID_VERIFIED` | NIN + ID documents verified | Core |
| `REFERENCES_VERIFIED` | References checked (rider) | Positive |
| `SACCO_AFFILIATION` | SACCO on record | Rider / some commercial |
| `STAGE_AFFILIATION` | Stage on record | Rider |
| `INSURANCE_ACTIVE` | Valid insurance on record | **High value** — see §7.3 |
| `INSURANCE_CONTINUITY` | Unbroken insurance cover (months) | **High value** |
| `TRAINING_COMPLETED` | Any CVT/partner training logged | Gateway |
| `ROAD_SAFETY_CERTIFIED` | Road safety course verified | Insurers, employers |
| `FIRST_AID_CERTIFIED` | First aid certificate verified | Insurers, employers |
| `DEFENSIVE_RIDING_CERTIFIED` | Defensive riding course | Rider / commercial |
| `HELMET_COMPLIANCE` | Helmet compliance attestation/check | Rider |
| `CLEAN_PERIOD_12M` | No trust-affecting complaints in 12m | Recovery / reward |
| `CLEAN_PERIOD_24M` | No trust-affecting complaints in 24m | Stronger reward |
| `CONSENT_CURRENT` | Data-sharing consent valid | Gate for partner share |

**Private category:** stage/sacco/helmet/rider training weights **zero or N/A** unless applicable; insurance + identity + documents weighted higher.

Each positive signal should have a matching **`trust_events` event_type** when first achieved (see §4.2), tier **`public`**.

### 7.2 Negative signals

| Factor code | Signal | v1 impact |
|-------------|--------|-----------|
| `SUSPENSION_ACTIVE` | Currently suspended | Strong (blocks Gold+) |
| `SUSPENSION_HISTORY` | Past suspension cleared | Light |
| `COMPLAINT_UPHELD_TRUST` | Stage B = **Verified** | Light; single event capped |
| `COMPLAINT_SEVERE_TRUST` | Stage B = **Severe** | Moderate |
| `COMPLAINT_REPEAT_UPHELD` | **Repeated** upheld (policy threshold, e.g. 2+ in 24m) | Moderate |
| `FRAUD_CONFIRMED` | Fraud / identity fraud confirmed by ops | Strong |

**Not in v1 negatives:** dismissed complaints, investigating, new, anonymous, unverified plates without link.

Negative events use tiers **`partner_soft`** / **`partner_enhanced`** / **`partner_hard`** / **`sealed`** — never on public timeline or passport detail.

### 7.3 Insurance before credit

Insurance signals are **less controversial** and **high value** for insurers and private owners. Include in **Trust Profile v1**.

| Phase | Insurance | Credit (CRB) |
|-------|-----------|--------------|
| **TP-1** | Self-attested + document upload | — |
| **TP-2** | Partner-verified / insurer API (with agreement) | — |
| **TP-3** | Continuity tracking, lapse detection | — |
| **TP-4+** | Mature insurance graph | — |
| **TP-5** | — | Credit mix / CRB (consent + legal + licensing) |

Credit bureau integration is **v5 at earliest** — regulation, licensing, data agreements, and privacy complexity are substantial.

---

## 8. Category weight philosophy (v1)

Positive budget **~85–90%** of trust level calculation; negatives capped so one upheld complaint cannot destroy a long clean record.

| Dimension | Rider | Taxi | Special hire | Commercial | Private |
|-----------|-------|------|--------------|------------|---------|
| Tenure + re-verification + docs | 30 | 30 | 30 | 25 | **40** |
| SACCO / stage / licence | 15 | 15 | 15 | 10 | 0 |
| Insurance | 15 | 15 | 15 | 15 | **25** |
| Training + compliance | 15 | 10 | 10 | 10 | 5 |
| References / registration quality | 10 | 10 | 10 | 10 | 10 |
| Clean periods (reward) | 10 | 10 | 10 | 10 | 10 |
| Trust-affecting complaints | **≤5** | **≤5** | **≤5** | **≤5** | **≤5** |
| Credit (CRB) | 0 | 0 | 0 | 0 | 0 |

---

## 9. Policy versioning

- Weights and thresholds in **`trust_profile_policies`** (not hard-coded).
- **`trust_events`** are never rewritten when policy changes; recomputation only affects **future** snapshots and level.
- Recompute snapshot on: new event, verify/re-verify, Stage B outcome, suspension lift.
- Nightly batch + on-demand for partner API.

---

## 10. API architecture

Access **tiers 0–4** (§3); legal disclosure **manual**; internal ops via admin RBAC. Implemented routes map to tiers as below (tier numbers align with §3.1).

### Tier 1 — Passport API (public)

```http
GET /api/v1/passport/{verification_id}
```

No auth. Returns Tier 1 fields only (§3.2).

```json
{
  "trust_level": "gold",
  "verification_status": "verified",
  "standing": "good",
  "profile": { "verifiedSince", "documents", "insuranceSummary", "training[]" },
  "timeline": [{ "occurred_at", "event_type", "label" }],
  "policy_version": "trust-v1.0.0",
  "computed_at": "2026-06-03T12:00:00Z",
  "disclaimers": []
}
```

### Tier 2 — Partner trust summary (Soft Search)

```http
GET /api/v1/partner/trust-summary/{verification_id}
Authorization: Bearer {partner_token}
X-Consent-Token: {registrant_consent_token}
```

Partner type must be allowed for Soft Search (§3.8). Logged to **`trust_profile_access_log`**.

```json
{
  "trust_level": "gold",
  "standing": "good",
  "trust_affecting_events": { "count": 1, "resolved": true },
  "months_since_last_event": 36,
  "active_suspension": false,
  "highest_severity": "moderate",
  "passport": {
    "profile": { "...Tier 1 fields...", "nationalIdNumber": "CM9000111222AB" },
    "trust_statements": [
      { "code": "VERIFIED_MEMBER", "tone": "positive", "params": { "year": 2021 } }
    ],
    "timeline": [ "...public events only..." ]
  },
  "disclaimers": []
}
```

Partners receive **`trust_statements`** (same highlights as public passport), not raw event codes alone. No categories, narratives, dates, or complaint IDs in Soft tier aggregates.

**Partner identity matching:** `passport.profile` also includes **`nationalIdNumber`** (NIN from registry) for consent-based searches so partners can align CVT results with their own records. NIN is **not** exposed on the public passport (`GET /api/v1/passport`).

### Tier 3 — Employment summary (Enhanced Search)

```http
GET /api/v1/partner/employment-summary/{verification_id}
Authorization: Bearer {partner_token}
X-Consent-Token: {registrant_consent_token}   // purpose = employment
```

**Employers and logistics / fleet only.** Rejects SACCOs, banks, stage leaders.

```json
{
  "standing": "good",
  "active_suspension": false,
  "verified_trust_events": 2,
  "highest_severity": "moderate",
  "recovery_period_months_clean": 24,
  "passport": { "...Tier 1 subset..." },
  "disclaimers": []
}
```

Still no descriptions, witness statements, complainant identity, or moderator notes.

### Tier 4 — Restricted conduct history (Hard Search) — **TP-6**

```http
GET /api/v1/restricted/conduct-history/{verification_id}
Authorization: Bearer {entitled_partner_token}
X-Justification: {application_or_policy_ref}
```

**Entitled insurers, optional vetted fleet, Trust Team only** (§3.5). Requires valid contract, not expired/revoked, justification per query. Every call audited; sealed records excluded.

```json
{
  "conduct_events": [
    {
      "category": "dangerous_driving",
      "severity": "moderate",
      "date": "2024-03",
      "status": "resolved"
    }
  ],
  "trust_summary": { "...Soft Search aggregates..." },
  "disclaimers": []
}
```

Never returns complainant identity, phone numbers, evidence files, or witness statements.

### Legal disclosure (manual — not self-service)

Ops workflow only: law enforcement request, court order, or formal legal request → Trust Team review → scoped export. Logged to **`law_enforcement_access_log`** (§3.6). No `GET` endpoint for LE self-service.

### Access audit tables

| Table | When |
|-------|------|
| **`trust_profile_access_log`** | Every partner API call (partner id, tier, verification id, consent ref, timestamp) |
| **`law_enforcement_access_log`** | Every manual legal disclosure (officer id, org, reason, case number, scope, timestamp) |

### Connect

Trust Level + Good Standing badge on assigned rider card; top 2–3 **public** timeline highlights. No partner tiers in passenger/rider apps.

---

## 11. Privacy, consent, disputes

### Purpose-specific consent

Registrants grant consent **per partner and per purpose**. Examples:

| Purpose | Consent copy (example) | Unlocks |
|---------|------------------------|---------|
| **Insurance** | “Allow ABC Insurance to access my Trust Profile for **underwriting**.” | Soft (+ Enhanced/Hard if insurer contract) |
| **Employment** | “Allow DHL Uganda to access my Trust Profile for **employment assessment**.” | Soft + Enhanced |
| **Finance** | “Allow XYZ SACCO to access my Trust Profile for **financing decision support**.” | Soft only |
| **Law enforcement** | No consent where **legally mandated** | Manual disclosure only |

Consent records: partner id, purpose enum, verification id, granted_at, expires_at, revoked_at.

### Other privacy rules

- Registrants view their **own** full history (including conduct, pre-seal) in portal — separate from public passport URL.
- Factor `data_source`: `verified_by_cvt` \| `self_reported` \| `partner_insurer` \| `training_provider` \| `crb` (future).
- Disputes → Trust Team review → **`EVENT_REVERSED`** or correction → recompute; audit manual overrides.
- Sealed records: registrant notified when sealed; may dispute seal eligibility.

**Required disclaimer:**

> CVT Trust Profile and Trust Timeline summarise information verified in the CVT registry and complaint outcomes that completed trust moderation. They are not a credit score, safety rating, or insurance approval. Partners apply their own policies.

---

## 12. Implementation phases

| Phase | Deliverable |
|-------|-------------|
| **TP-0** | This document + Stage B fields designed |
| **TP-1** | **`trust_events`** + Tier 1 passport UI/API (positive timeline, standing) |
| **TP-2** | Training + insurance events; Good Standing compute |
| **TP-3** | Trust level + Stage B conduct events; visibility tiers |
| **TP-4** | Tier 2 Soft Search API + purpose-specific consent UX |
| **TP-4b** | Partner portal/API **search context** + `partner_search_requests`; partner profile capabilities | **Implemented** |
| **TP-5** | Tier 3 Enhanced API (employers / logistics); partner-type + profile enforcement | **Implemented** |
| **TP-6** | Tier 4 Hard Search (insurer contract); `trust_profile_access_log` | **Implemented** |
| **TP-7** | Sealed records job + rehabilitation policy | **Implemented** |
| **TP-8** | Manual legal disclosure workflow + `law_enforcement_access_log` | **Implemented** |
| **TP-9+ (v5)** | CRB — separate legal programme |

Consent records: partner id, purpose enum, verification id, granted_at, expires_at, revoked_at.

**Language (required):** Use **trust profile for financing decision support** (or similar) for banks, MFIs, and SACCOs. Do **not** use “credit score”, “credit scoring”, or “credit check” in product copy, APIs, or partner contracts until a separate **CRB integration programme** (v5+) is live and licensed. Until then, CVT provides registry-verified trust signals for the partner’s own policy — not bureau scoring.

### Registrant visibility

Registrants see **which partner organisations** accessed their Trust Profile, **when**, and **for what purpose** (from consent), on:

- **Public passport** — `/passport/{verificationId}` → “Who has viewed your Trust Profile” (unlocked with **registered mobile** match; RPC `get_rider_partner_access_history`).
- **Admin rider profile** — same list for staff (transparency / support).

Does **not** expose partner internal notes, application reference numbers, or loan amounts to the rider in v1 (those stay in future `partner_search_requests` for audit; rider sees org + purpose + tier + date only).

---

## 14. Partner organisations, profiles, and search context

Partners access Trust Profile through a **partner portal** and/or **API**. Every lookup is tied to a **declared search reason** (category + structured fields), the partner’s **profile capabilities**, and **registrant consent** (or insurer contract / lawful basis where applicable).

### 14.1 Terminology

| Term | When to use |
|------|-------------|
| **Trust profile for financing decision support** | Banks, MFIs, SACCOs — Soft Search with finance purpose (v1–v4) |
| **Trust profile for employment assessment** | Employers, logistics / fleet |
| **Trust profile for underwriting** | Insurers (may unlock Enhanced / Hard per contract) |
| **Credit scoring / credit check / CRB** | **Only after** formal CRB integration (v5+), separate legal programme — not before |

### 14.2 Partner profile (capabilities at setup)

Each row in **`trust_partners`** (or future partner admin onboarding) defines what that organisation **may** do. Capabilities are **fixed by CVT ops** at setup — not chosen per search by the partner.

| Profile field (direction) | Purpose |
|---------------------------|---------|
| `partner_type` | Baseline role: `employer`, `logistics`, `insurer`, `bank_mfi`, `sacco`, … |
| `partner_risk_class` | **v1.1+** — `low` \| `medium` \| `high` \| `restricted` (§3.9) |
| `allowed_search_categories` | e.g. `employment`, `fleet_onboarding`, `financing`, `insurance_underwriting` — **subset** per org |
| `allowed_access_tiers` | e.g. `partner_soft`, `partner_enhanced` — never above profile max |
| `allowed_consent_purposes` | Which consent purposes this org may request (`employment`, `finance`, `insurance`) |
| `allow_hard_search` | **TP-6** — explicit flag; never default for all insurers |
| `hard_search_contract_ref` | Enterprise contract id |
| `hard_search_expires_at` | Annual review |
| `hard_search_revoked_at` | Kill switch |
| `active` | Suspend all access when false |

**Enforcement rule:** An **employer** profile might allow only `employment` + Soft + Enhanced. If their user submits a lookup with category `financing`, the API **rejects** before returning data — even with a valid consent token for another purpose. Same partner cannot “upgrade” tier by changing a form field.

Example matrix (aligned with §3.8):

| Partner type | Allowed search categories | Max tier |
|--------------|---------------------------|----------|
| Employer | `employment` | Soft + Enhanced |
| Logistics / fleet | `employment`, `fleet_onboarding` | Soft + Enhanced |
| Bank / MFI | `financing` | Soft only |
| SACCO | `financing` | Soft only |
| Insurer | `insurance_underwriting` | Soft + Enhanced + Hard (contract) |

Stage leaders and general public: **no** partner profile / no search API.

### 14.3 Per-lookup search context (partner portal + API)

Before results are returned, the partner user supplies:

1. **Subject** — verification ID (v1); later plate / NIN with policy
2. **Search category** — must be in `allowed_search_categories` on partner profile
3. **Structured context** — JSON validated against a **schema per category** (no long free-text narratives)

| Search category | Example structured fields (v1 draft) |
|-----------------|-------------------------------------|
| `employment` | `role_title`, `work_location`, `application_reference` |
| `fleet_onboarding` | `fleet_operator`, `route_or_depot`, `application_reference` |
| `financing` | `product_type` (loan, asset finance, …), `amount_ugx`, `currency`, `application_reference`, `consent_confirmed` (boolean attestation) |
| `insurance_underwriting` | `policy_type`, `sum_insured_band`, `application_reference` |

CVT **stores** this context for audit and analytics — it does **not** treat loan amount as a credit score input in v1–v4. It records *why* the partner looked and *under what application*.

**Consent match:** Lookup category must align with registrant consent **purpose** (e.g. `financing` category requires `finance` purpose on the consent token; `employment` requires `employment` purpose).

### 14.4 Data model (direction)

| Table | Role |
|-------|------|
| **`trust_partners`** | Org profile + capabilities (§14.2) — **implemented (TP-4)** with `partner_type`; extend with `allowed_*` arrays |
| **`trust_profile_consents`** | Registrant grants per partner + purpose — **implemented (TP-4)** |
| **`partner_search_requests`** | One row per lookup attempt: partner id, partner user id, verification id, category, `context` jsonb, consent id, tier served, result status, timestamp |
| **`trust_profile_access_log`** | Every successful (or denied) API outcome — link to `partner_search_requests` — **implemented (TP-4)** basic form |

Denied lookups (wrong category, expired consent, tier not allowed) are logged with **no** profile payload returned.

### 14.5 API shape (target)

```http
POST /api/v1/partner/trust-search
Authorization: Bearer {partner_api_key}
X-Consent-Token: {registrant_consent_token}
Content-Type: application/json

{
  "verification_id": "CVT-RDR-2026-000042",
  "search_category": "financing",
  "context": {
    "product_type": "personal_loan",
    "amount_ugx": 2000000,
    "application_reference": "APP-2026-8812",
    "consent_confirmed": true
  }
}
```

Response tier is chosen from partner profile + category + consent — not from partner-declared “I want Hard Search”. Existing `GET /api/v1/partner/trust-summary/{id}` remains; POST search wraps it with context (TP-4b).

### 14.6 CRB and credit scoring (deferred)

When CRB integration is approved (v5+):

- Separate consent copy, retention rules, and possibly **`data_source = crb`** on events
- Only then may product and contracts use **credit scoring** language where legally accurate
- Trust Profile remains distinct: CVT verification + conduct + optional CRB **appendix**, not a replacement bureau

Until then, partners receive **trust profile for financing decision support** — aggregates and standing, not a bureau score.

---

## 13. Open decisions

- [x] **Hard Search scope** — privileged access; contracted insurers only; optional vetted fleet — not all insurers (§3.5, [TRUST_ARCHITECTURE_V1.md](/cvt/docs/trust-architecture-v1))
- [x] **Tier 0 owner view** — registrant full history + disputes — documented; implementation v1.1+
- [x] **Facts vs interpretations** — `trust_events` immutable; snapshots/policy versioned ([TRUST_ARCHITECTURE_V1.md](/cvt/docs/trust-architecture-v1) §1)
- [x] **`partner_risk_class` migration** — `20260612120000`; map from `partner_type`; enforce in `trust_resolve_search_tier` / `trust_partner_allows_enhanced`
- [x] **Trust statements** — §2.6.1; migrations `20260613120000`–`20260613120002`; passport UI highlights; en/lg messages
- [x] **Trust milestones table** — §2.6.2; `trust_sync_milestones` on recompute
- [x] **Trust explanations table** — §2.6.3; `trust_sync_explanations` on recompute
- [x] **Partner API:** include `trustStatements` on search/passport payloads (`passport.trust_statements`)
- [x] **Staff admin rider page:** `trust_milestones` + `trust_explanations` panels (`trust-derived-panels.tsx`)
- [x] **Public passport:** achievement badges via `get_trust_passport` → `milestones[]`
- [x] **Owner self-service (Tier 0):** phone unlock on `/passport/{id}` — `get_trust_owner_insights` + `TrustPassportOwnerPanel` (explanations, milestones, partner access history)
- [x] **Explanation i18n (app):** `trustDerived.explanation.*` + `formatTrustExplanationMessage()` from `code` + factor codes (DB `message` retained for audit, not shown in UI)
- [ ] **Dormancy thresholds** — confirm 2y / 3y / 5y and what counts as “activity”
- [ ] **Streak definitions** — confirm thresholds and interaction with dormancy
- [ ] **`confidence_level` rollout** — backfill existing events as `verified` / `system_generated`
- [ ] **Owner view: sealed event copy** — what registrants see when a record is sealed
- [ ] Stage B field names on `complaints` vs separate `complaint_trust_moderation` table
- [ ] Anonymous complaint policy (default exclude from all partner tiers)
- [ ] Repeat upheld threshold (2 in 24m vs 3 in 36m)
- [x] Grandfather `CVT-UG-*` / `CTV-UG-*` — new IDs use `CVT-RDR-*` (migration `20260606120000`)
- [ ] Minimum data before publishing passport (“building profile” state)
- [ ] Person-level merged timeline vs registration-only default
- [ ] Seal eligibility: confirm 5-year window and “moderate only” scope
- [ ] Conduct category taxonomy for Hard Search (insurer-facing labels)
- [ ] Consent expiry default (e.g. 90 days vs per-application)
- [x] **Profile photo (Tier 4 only)** — `profile_photo_url` on Hard Search response (signed URL from `riders.profile_photo_path`); not on public passport (Tier 1)
- [ ] **Partner search categories v1** — sign-off on field schemas for `employment`, `financing`, `insurance_underwriting`, `fleet_onboarding`
- [x] **Financing language** — “financing decision support”, not credit scoring, until CRB v5+
- [x] **Partner profile restrictions** — search category + tier caps configured on `trust_partners` at setup; API enforces (§14.2)

---

## Document history

- **2026-05-29** — Derived layers §2.6: trust statements (highlights), `trust_milestones`, `trust_explanations`; i18n for statements in app messages. See [TRUST_ARCHITECTURE_V1.md](/cvt/docs/trust-architecture-v1).
- **2026-05-29** — Architecture review: Tier 0 owner view; privileged Hard Search; `partner_risk_class`; dormancy; trust streaks; `confidence_level`; facts vs interpretations.
- **Partner organisations (§14)** — profile capabilities at setup; per-lookup search context; financing decision support language; CRB/credit scoring deferred to v5+.
- **Four access tiers** + party matrix — Public, Soft, Enhanced (employers/logistics), Hard (insurers/internal); SACCOs/stage leaders restricted; LE/courts manual only.
- **Sealed records** — rehabilitation after clean recovery; hidden from insurers and partners.
- **API architecture** — `/passport`, `/partner/trust-summary`, `/partner/employment-summary`, `/restricted/conduct-history`; purpose-specific consent.
- Added **Trust Timeline** / **`trust_events`**; passport = Profile + Timeline + Level + Standing.
- Renamed from **CVT Trust Score** → **CVT Trust Profile**; v1 positive-dominant; two-stage moderation; insurance before credit; CRB v5+.
