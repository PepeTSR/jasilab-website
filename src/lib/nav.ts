import { cvtAppUrl, cvtPath, isCvtRootSite } from "./site";
import { isProductTheme, isSuperhumanTheme } from "./cvt-theme";

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

/** Primary nav — short product nav on cvt.co.ug; full docs nav on jasilab.net/cvt */
export function getCvtNav(pathname = ""): CvtNavItem[] {
  if (isCvtRootSite) {
    const items: CvtNavItem[] = [
      { href: cvtPath(), label: "Home" },
      { href: cvtPath("#how-it-works"), label: "How it works" },
    ];
    if (isProductTheme) {
      items.push({ href: cvtPath("platform"), label: "Platform" });
      items.push({ href: cvtPath("guides"), label: "Guides" });
    } else {
      items.push({ href: cvtPath("vision"), label: "Vision" });
    }
    items.push({ href: cvtPath("partners"), label: "Partners" });

    // Product themes: primary CTA lives in the header button (top-right), not inline nav.
    if (!isProductTheme) {
      items.push(getCvtPrimaryCta(pathname));
    }

    return items;
  }

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

/** Secondary links — footer on cvt.co.ug only */
export function getCvtFooterNav(): CvtNavItem[] {
  if (!isCvtRootSite) return [];

  if (isProductTheme) {
    return [
      { href: cvtPath("vision"), label: "Vision" },
      { href: cvtPath("roadmap"), label: "Roadmap" },
      { href: cvtPath("map"), label: "Map" },
      { href: cvtPath("concepts"), label: "Concepts" },
      { href: cvtAppUrl, label: "Registry app", external: true },
    ];
  }

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

/** Public apply landing page (locale-prefixed on cvt.ug). */
export const cvtApplyUrl = `${cvtAppUrl}/en/apply`;

/** Enterprise partner portal on cvt.ug. */
export const cvtEnterpriseUrl = `${cvtAppUrl}/enterprise`;

export type CvtPrimaryCta = {
  href: string;
  label: string;
  external: true;
};

export function getCvtEnterpriseCta(): CvtPrimaryCta {
  return { href: cvtEnterpriseUrl, label: "Enterprise", external: true };
}

export function isPartnersPath(pathname: string): boolean {
  const norm = pathname.replace(/\/$/, "") || "/";
  return norm === "/partners" || norm.endsWith("/partners");
}

/** Primary action in header, hero, and mobile bar — superhuman dev uses Get verified. */
export function getCvtPrimaryCta(pathname?: string): CvtPrimaryCta {
  if (pathname && isPartnersPath(pathname)) {
    return getCvtEnterpriseCta();
  }
  if (isProductTheme) {
    return { href: cvtApplyUrl, label: "Get verified", external: true };
  }
  return { href: cvtWhatsAppUrl, label: "Try lookup", external: true };
}

/** Top-right header button — Enterprise on Partners, otherwise primary CTA. */
export function getCvtHeaderCta(pathname: string): CvtPrimaryCta {
  return getCvtPrimaryCta(pathname);
}

export const cvtAppHostname = new URL(cvtAppUrl).hostname;

export function getCvtExploreLinks() {
  if (isCvtRootSite) {
    return [
      { href: cvtPath("vision"), label: "Vision", desc: "Why portable trust matters for Uganda and beyond" },
      { href: cvtPath("partners"), label: "Partners", desc: "Insurers, employers and integration" },
      { href: cvtPath("guides"), label: "Guides", desc: "Policies and frameworks" },
      { href: cvtPath("#whats-live"), label: "Try lookup", desc: "WhatsApp plate verification" },
    ];
  }

  return [
    { href: cvtPath("vision"), label: "Vision", desc: "Why portable trust matters for Uganda and beyond" },
    { href: cvtPath("map"), label: "Project map", desc: "From transport to full platform" },
    { href: cvtPath("roadmap"), label: "Roadmap", desc: "What's live and what's next" },
    { href: cvtPath("concepts"), label: "Concepts", desc: "Plain-language explainers" },
    { href: cvtPath("guides"), label: "Guides", desc: "Policies and partner overview" },
    { href: cvtPath("#whats-live"), label: "Try lookup", desc: "WhatsApp plate verification" },
  ];
}
