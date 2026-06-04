---
title: "CVT Vision"
description: "Registry, Trust Profile, and Connect — platform north star."
version: "2026-06"
order: 1
---

# CVT Vision — Registry, Trust Profile, and Connect

CVT (**Commercial Verification Terminal**) is evolving from a **boda rider verification portal** into a **multi-category registry and trust platform** for people and vehicles in Uganda.

This document is the north star for product and engineering. Detailed rules live in linked specs; the admin portal MVP for boda riders remains the operational baseline until new categories ship.

---

## Three layers, one platform

```text
┌─────────────────────────────────────────────────────────────┐
│  CVT Connect (channels)                                     │
│  WhatsApp · PWA · partner APIs · insurer / employer UI      │
└───────────────────────────┬─────────────────────────────────┘
                            │ reads
┌───────────────────────────▼─────────────────────────────────┐
│  CVT Trust Profile                                          │
│  Profile + Timeline (trust_events) + Trust Level            │
└───────────────────────────┬─────────────────────────────────┘
                            │ reads
┌───────────────────────────▼─────────────────────────────────┐
│  CVT Registry                                               │
│  Register · verify · documents · complaints · plate lookup    │
│  Categories: rider, taxi, special_hire, commercial, private   │
└─────────────────────────────────────────────────────────────┘
```

| Layer | What it does | Primary users |
|-------|----------------|---------------|
| **Registry** | Capture and verify registrations by category; complaints; unverified plates; audit | Field agents, verification officers, ops |
| **Trust Profile** | **Profile + Trust Timeline (`trust_events`) + Trust Level** — verified facts over time | Insurers, employers, logistics, partners |
| **Connect** | Uses registry + trust profile in channels (boda hail today; timeline highlights tomorrow) | Passengers, riders, WhatsApp, partners |

**Connect consumes trust; it is not the profile engine.** Boda dispatch can continue while registry and trust expand.

---

## Evolution path

| Phase | Focus | Status |
|-------|--------|--------|
| **1 — Boda MVP** | `riders` registry, admin portal, complaints, plates, Connect hail | **Live / in progress** |
| **2 — Multi-category registry** | Taxi, special hire, commercial, private; prefix IDs; dashboard tabs | **Planned** — [REGISTRY_CATEGORIES.md](/cvt/docs/registry-categories) |
| **3 — Trust Profile v1** | TP-1–TP-4: passport, training/insurance, Stage B, Soft Search | **Done** — [TRUST_PROFILE.md](/cvt/docs/trust-profile) |
| **4 — Partner APIs** | Enhanced (TP-5), Hard Search (TP-6), partner portal (TP-4b) | **In progress** — TP-5 shipped |
| **6 — Connect trust UI** | Trust level + timeline highlights on rider card | **Future** |
| **7 — Credit (CRB)** | Credit-mix signals — **v5+**, separate legal programme | **Far future** |

---

## Positioning (required language)

- CVT **verifies submitted registration information** and maintains an **accountability record**.
- CVT publishes a **Trust Profile** (current profile + **Trust Timeline** + trust level), not a credit score or safety guarantee.
- **Higher trust levels** mean more **verified positive signals over time** (tenure, insurance, training, clean trust-moderated record) — not “safe driver” or “loan approved.”
- **Private (non-commercial)** registrations support owner/vehicle trust for **insurers**; not commercial operator licensing.
- **Raw accusations never affect trust** — only complaints that complete **two-stage trust moderation**.

---

## Technical principles

1. **Riders first** — existing `riders` routes, Connect, WhatsApp stay stable.
2. **Person-centric** — normalised NIN links registrations; profile/timeline can rollup with consent.
3. **Prefix by category** — `CVT-RDR-` for riders today; `CVT-TAX-`, … when multi-category ships.
4. **Policy as data** — weights in versioned `trust_profile_policies`.
5. **Progressive disclosure** — four API tiers; employers get Enhanced, not Hard; SACCOs Soft only; LE manual.
6. **Insurance before credit** — insurer signals in v1–v3; CRB deferred to v5+.
7. **Rehabilitation** — sealed records after clean recovery; not permanent punishment.

---

## Document map

| Document | Contents |
|----------|----------|
| [PRODUCT_SPEC.md](/cvt/docs/vision) | Admin portal MVP (boda baseline) |
| [REGISTRY_CATEGORIES.md](/cvt/docs/registry-categories) | Five categories, ID prefixes |
| [TRUST_PROFILE.md](/cvt/docs/trust-profile) | Profile, `trust_events` timeline, trust level, moderation, phases |
| [TRUST_ARCHITECTURE_V1.md](/cvt/docs/trust-architecture-v1) | Trust platform blueprint — layers, tiers, engines, risk class |
| [../CVT Hail/docs/CVT_CONNECT_SPEC.md](../CVT%20Hail/docs/CVT_CONNECT_SPEC.md) | Connect channels |
| [../CVT Hail/docs/DISPATCH_LOGIC.md](../CVT%20Hail/docs/DISPATCH_LOGIC.md) | Boda dispatch |

---

## Non-goals (platform-wide)

- CVT is **not** a lender, insurer, or credit bureau.
- CVT does **not** guarantee trip safety, claim approval, or loan eligibility.
- **Anonymous, rumour, or uninvestigated complaints** must not affect Trust Profile.
- **CRB / credit-mix** integration is out of scope until Trust Profile **v5+** (regulation, licensing, privacy).
