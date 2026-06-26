import { cvtPath } from "./site";

export const jasiLabNav = [
  { href: "/research", label: "Research" },
  { href: "/products", label: "Products" },
  { href: "/journal", label: "Journal" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
] as const;

export const productLinks = [
  {
    href: "https://cvt.co.ug",
    label: "CVT",
    tagline: "Public trust platform for mobile identities — starting with commercial transport in Uganda.",
  },
  { href: "/products/hay", label: "HAY", tagline: "Coming soon." },
  { href: "/products/carehome", label: "CareHome Optimisation", tagline: "Coming soon." },
] as const;

export function getCvtNav() {
  return [
    { href: cvtPath(), label: "Home" },
    { href: cvtPath("vision"), label: "Vision" },
    { href: cvtPath("map"), label: "Map" },
    { href: cvtPath("roadmap"), label: "Roadmap" },
    { href: cvtPath("guides"), label: "Guides" },
    { href: cvtPath("concepts"), label: "Concepts" },
    { href: cvtPath("blog"), label: "Blog" },
  ];
}

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

export const cvtWhatsAppUrl = "https://wa.me/256792497830";

export function getCvtExploreLinks() {
  return [
    { href: cvtPath("vision"), label: "Vision", desc: "Why portable trust matters — transport is the first pilot" },
    { href: cvtPath("map"), label: "Project map", desc: "From pilot to full platform" },
    { href: cvtPath("roadmap"), label: "Roadmap", desc: "What's live and what comes next" },
    { href: cvtPath("concepts"), label: "Concepts", desc: "Plain-language explainers" },
    { href: cvtPath("guides"), label: "Guides", desc: "Policies and integration overview" },
    { href: cvtPath("#first-pilot"), label: "Transport pilot", desc: "Try WhatsApp plate lookup" },
  ];
}
