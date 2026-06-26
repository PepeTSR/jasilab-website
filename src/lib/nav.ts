import { cvtAppUrl, cvtPath } from "./site";

export const jasiLabNav = [
  { href: "/research", label: "Research" },
  { href: "/products", label: "Products" },
  { href: "/journal", label: "Journal" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
] as const;

export const productLinks = [
  {
    href: "/cvt",
    label: "CVT",
    tagline: "Trust platform for mobile identities — live in Kampala commercial transport.",
  },
  { href: "/products/hay", label: "HAY", tagline: "Coming soon." },
  { href: "/products/carehome", label: "CareHome Optimisation", tagline: "Coming soon." },
] as const;

export type CvtNavItem = {
  href: string;
  label: string;
  external?: boolean;
};

/** Primary product nav — kept short for cvt.co.ug */
export function getCvtNav(): CvtNavItem[] {
  return [
    { href: cvtPath(), label: "Home" },
    { href: cvtPath("#how-it-works"), label: "How it works" },
    { href: cvtPath("vision"), label: "Vision" },
    { href: cvtPath("partners"), label: "Partners" },
    { href: cvtWhatsAppUrl, label: "Try lookup", external: true },
  ];
}

/** Secondary links — footer and explore sections */
export function getCvtFooterNav(): CvtNavItem[] {
  return [
    { href: cvtPath("guides"), label: "Guides" },
    { href: cvtPath("roadmap"), label: "Roadmap" },
    { href: cvtPath("map"), label: "Map" },
    { href: cvtPath("concepts"), label: "Concepts" },
    { href: cvtAppUrl, label: "Registry app", external: true },
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

export { cvtAppUrl };
export const cvtWhatsAppPhone = "+256 792 497830";
export const cvtWhatsAppUrl = "https://wa.me/256792497830";

export const cvtAppHostname = new URL(cvtAppUrl).hostname;

export function getCvtExploreLinks() {
  return [
    { href: cvtPath("vision"), label: "Vision", desc: "Why portable trust matters for Uganda and beyond" },
    { href: cvtPath("partners"), label: "Partners", desc: "Insurers, employers and integration" },
    { href: cvtPath("guides"), label: "Guides", desc: "Policies and frameworks" },
    { href: cvtPath("#whats-live"), label: "Try lookup", desc: "WhatsApp plate verification" },
  ];
}
