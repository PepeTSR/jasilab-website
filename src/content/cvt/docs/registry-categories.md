---
title: "Registry Categories"
description: "Multi-category registry IDs and verification categories."
version: "draft"
order: 4
---

# CVT Registry — Categories and verification IDs

The registry holds **verified records** for people and vehicles across five categories. Boda **riders** use the existing `public.riders` table and `/admin/riders/*` routes.

**Phase A (shipped):** **Taxi / cab** and **special hire** use `public.registry_registrants` with extension tables — admin at `/admin/taxi`, `/admin/special-hire`, hub at `/admin/register`. IDs: `CVT-TAX-*`, `CVT-SPH-*`. Trust passport resolves these prefixes after verify.

---

## Categories

| Category | Code | Audience | Primary use case |
|----------|------|----------|------------------|
| **Rider** | `rider` | Boda boda operators | Commercial operator verification; CVT Connect dispatch |
| **Taxi** | `taxi` | Taxi operators / drivers | Licensed taxi verification and accountability |
| **Special hire** | `special_hire` | Chauffeur / hire drivers | Special-hire licence and operator verification |
| **Commercial vehicle** | `commercial` | Trucks, buses, vans, fleet | Commercial transport and fleet accountability |
| **Private vehicle** | `private` | Non-commercial owners | **Owner + vehicle trust** for insurers and partners (not commercial operator licensing) |

### Private (non-commercial)

- **Not** a commercial operator category in the same sense as rider/taxi.
- Focus: **identity**, **vehicle identity** (plate, logbook), **tenure**, and **complaint history** where logged against that owner/vehicle.
- Intended consumers: **insurance underwriting**, claims context, partner due diligence — via **Trust Profile (Trust Passport)** and future APIs, with consent.
- Scoring weights for stage/sacco/operator licence are **zero or N/A** (see [TRUST_PROFILE.md](/cvt/docs/trust-profile)).

---

## Verification ID format (prefix by type)

Each verified registration receives a **unique public verification ID** when approved to `verified` status.

**Pattern:** `CVT-{TYPE}-{YEAR}-{SEQUENCE}` (riders use `CVT-RDR`; legacy `CVT-UG` / `CTV-UG` remain valid)

| Category | Type prefix | Example |
|----------|-------------|---------|
| Rider (boda) | `RDR` | `CVT-RDR-2026-000042` |
| Taxi | `TAX` | `CTV-TAX-2026-000018` |
| Special hire | `SPH` | `CTV-SPH-2026-000003` |
| Commercial | `CMV` | `CTV-CMV-2026-000112` |
| Private | `PRV` | `CTV-PRV-2026-000556` |

**Rules (target behaviour):**

- `{YEAR}` — UTC year at verification (same as current rider IDs).
- `{SEQUENCE}` — zero-padded numeric sequence **per type per year** (independent counters per prefix).
- Existing rider IDs (`CVT-UG-*`, `CTV-UG-*`) remain valid; **new** rider verifications use `CVT-RDR-*` (see migration `20260606120000`).
- Public QR and plate lookup resolve **any** prefix to the correct registry record.

---

## Admin portal routes (target)

| Category | Registration entry | List / queue | Dashboard tab |
|----------|-------------------|--------------|---------------|
| Rider | `/admin/riders/new` (unchanged) | `/admin/riders` | `?tab=rider` |
| Taxi | `/admin/taxi/new` | `/admin/taxi` | `?tab=taxi` |
| Special hire | `/admin/special-hire/new` | `/admin/special-hire` | `?tab=special_hire` |
| Commercial | `/admin/commercial/new` | `/admin/commercial` | `?tab=commercial` |
| Private | `/admin/private/new` | `/admin/private` | `?tab=private` |

**Registration hub (target):** `/admin/register` — category cards linking to the routes above.

Implementation should use **shared registration components** driven by category config (fields, documents, steps), not five full copies of the rider wizard.

---

## Data model (direction)

**Phase A (minimal disruption):**

- Keep `public.riders` for boda.
- Add `registry_category` enum and category-specific tables (or a shared `registrants` parent + extension tables) for new categories.
- Shared: status lifecycle, documents, complaints, audit, unverified plates, auto-link on verify.

**Phase B (unification):**

- Optional `registrants` parent with 1:1 extensions per category.
- Unified `lookup_by_plate(plate)` RPC across all categories.
- Person dedupe on normalised NIN for cross-category Trust Profile.

See [CVT_VISION.md](/cvt/docs/vision) for phasing.

---

## Category-specific fields (draft)

Fields beyond shared person/vehicle core are stored on extension tables or typed JSON with schema validation.

### Shared core (all categories)

- Full legal name, phone(s), NIN, DOB, gender (where collected)
- Vehicle registration (plate), district / service area
- Consent flags and timestamps
- Registration agent, status, verification ID, expiry
- Internal notes, audit trail

### Rider (existing)

- Motorcycle make/model/colour, driving permit, stage, sacco, alternate riders, references, payments (registration fee)

### Taxi (draft)

- Taxi operator / owner name, taxi licence number, seating capacity, base area, permit expiry

### Special hire (draft)

- Special-hire licence, operator type, base location, permit expiry

### Commercial (draft)

- Company / fleet name, TIN, vehicle class (truck/bus/van), load type, operator licence

### Private (draft)

- Owner relationship to vehicle (owner / authorised driver), logbook reference, primary use declaration (personal/non-commercial)
- **No** stage/sacco/operator licence required unless applicable

Exact field lists require sign-off with ops/regulatory input before schema migration.

---

## Complaints and plates

- Complaints may reference **any** registry category (`registrant_id` + category, retaining `rider_id` for backward compatibility).
- Unverified plate lookup and auto-link on verify apply to **all** categories once unified lookup exists.
- WhatsApp plate lookup should eventually call unified lookup, not `riders` only.

---

## Connect scope by category

| Category | CVT Connect dispatch |
|----------|----------------------|
| Rider | **Yes** (boda hail, rider app, WhatsApp `BODA`) |
| Taxi, special hire, commercial, private | **No** (registry + trust only at this stage) |

Connect may later **display Trust Passport summaries** for any category where product and consent allow; dispatch remains rider-specific until product expands.
