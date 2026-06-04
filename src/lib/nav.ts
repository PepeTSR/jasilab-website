export const jasiLabNav = [
  { href: "/research", label: "Research" },
  { href: "/products", label: "Products" },
  { href: "/journal", label: "Journal" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
] as const;

export const productLinks = [
  { href: "/cvt", label: "CVT", tagline: "Connected Verification Trust — registry and trust infrastructure for mobility." },
  { href: "/products/hay", label: "HAY", tagline: "Coming soon." },
  { href: "/products/carehome", label: "CareHome Optimisation", tagline: "Coming soon." },
] as const;

export const cvtNav = [
  { href: "/cvt", label: "Home" },
  { href: "/cvt/vision", label: "Vision" },
  { href: "/cvt/map", label: "Map" },
  { href: "/cvt/roadmap", label: "Roadmap" },
  { href: "/cvt/guides", label: "Guides" },
  { href: "/cvt/docs", label: "Documents" },
  { href: "/cvt/blog", label: "Blog" },
] as const;

export const cvtConcepts = [
  { slug: "trust-profile", title: "Trust Profile", summary: "Current profile, timeline, and trust level derived from verified facts." },
  { slug: "trust-timeline", title: "Trust Timeline", summary: "Append-only trust_events — history that never changes silently." },
  { slug: "trust-level", title: "Trust Level", summary: "Bronze through Platinum — verified positive signals over time." },
  { slug: "trust-passport", title: "Trust Passport", summary: "Portable, consent-gated view of standing for owners and partners." },
  { slug: "good-standing", title: "Good Standing", summary: "Policy-derived status from clean record, insurance, and tenure." },
  { slug: "stage-b-moderation", title: "Stage B Moderation", summary: "Two-stage complaints — raw accusations never affect trust." },
  { slug: "soft-search", title: "Soft Search", summary: "Tier 1 partner view — summary standing without conduct detail." },
  { slug: "enhanced-search", title: "Enhanced Search", summary: "Tier 2 — employer-grade detail under explicit consent." },
  { slug: "hard-search", title: "Hard Search", summary: "Tier 3 — restricted legal disclosure with manual approval." },
] as const;

export const cvtAppUrl = "https://cvt.jasilab.net";
