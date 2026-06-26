import { cvtAppUrl, cvtPath } from "./site";
import { cvtEnterpriseUrl, cvtWhatsAppUrl } from "./nav";

export type CvtProductStatus = "live" | "building" | "pilot" | "planned" | "concept";

export type CvtProductLayer = "platform" | "registry" | "trust" | "connect" | "enterprise" | "data";

export type CvtProduct = {
  id: string;
  name: string;
  tagline: string;
  purpose: string;
  status: CvtProductStatus;
  layer: CvtProductLayer;
  /** Show on homepage “live products” band */
  featured?: boolean;
  href?: string;
  external?: boolean;
};

export const cvtPlatformStatement =
  "CVT is public trust infrastructure — enabling people, organisations and assets to build, verify and share trusted identities and accountable histories.";

export const statusLabels: Record<CvtProductStatus, string> = {
  live: "Live",
  building: "In development",
  pilot: "Pilot",
  planned: "Planned",
  concept: "Concept",
};

export const cvtProducts: CvtProduct[] = [
  {
    id: "verify",
    name: "CVT Verify",
    tagline: "The flagship product",
    purpose: "Create trusted, verifiable identities for people providing services — registration, documents, complaints and public lookup.",
    status: "live",
    layer: "registry",
    featured: true,
    href: `${cvtAppUrl}/lookup`,
    external: true,
  },
  {
    id: "connect",
    name: "CVT Connect",
    tagline: "The communications layer",
    purpose: "Trusted interactions through channels people already use — WhatsApp plate lookup, contact requests and future dispatch integrations.",
    status: "live",
    layer: "connect",
    featured: true,
    href: cvtWhatsAppUrl,
    external: true,
  },
  {
    id: "passport",
    name: "CVT Passport",
    tagline: "Portable professional identity",
    purpose: "Verification, qualifications, experience, training, insurance and service history — shareable as a Trust Passport.",
    status: "live",
    layer: "trust",
    featured: true,
    href: cvtPath("guides/building-a-trust-passport"),
  },
  {
    id: "enterprise",
    name: "CVT Enterprise",
    tagline: "For employers and fleets",
    purpose: "Manage trusted workforces — staff verification, consent-based searches, fleet tools and compliance dashboards.",
    status: "pilot",
    layer: "enterprise",
    href: cvtEnterpriseUrl,
    external: true,
  },
  {
    id: "api",
    name: "CVT API",
    tagline: "For developers and partners",
    purpose: "Verify plates and profiles, check consent, organisation and insurance lookups — build on the platform.",
    status: "building",
    layer: "enterprise",
    href: cvtPath("partners"),
  },
  {
    id: "insights",
    name: "CVT Insights",
    tagline: "Aggregated intelligence",
    purpose: "Lookup trends, complaint hotspots and service demand — without exposing personal data.",
    status: "planned",
    layer: "data",
  },
  {
    id: "circles",
    name: "CVT Circles",
    tagline: "Community finance signals",
    purpose: "Digital rotating savings groups that generate contribution history and financial trust signals — not a savings product.",
    status: "concept",
    layer: "data",
  },
  {
    id: "trace",
    name: "CVT Trace",
    tagline: "Supply chain trust events",
    purpose: "Track goods from harvest to buyer — every handoff becomes a verified trust event.",
    status: "concept",
    layer: "registry",
  },
  {
    id: "learn",
    name: "CVT Learn",
    tagline: "Professional development",
    purpose: "Courses and certificates that improve Trust Profiles — road safety, customer service, financial literacy.",
    status: "planned",
    layer: "trust",
  },
  {
    id: "protect",
    name: "CVT Protect",
    tagline: "Verified incident records",
    purpose: "Lost property, theft references and insurance incidents — controlled disclosure, not a public blacklist.",
    status: "planned",
    layer: "trust",
  },
  {
    id: "identity",
    name: "CVT Identity",
    tagline: "The long-term identity layer",
    purpose: "One CVT ID that proves who you are, what you do, what you've learned and your current standing.",
    status: "building",
    layer: "platform",
  },
  {
    id: "exchange",
    name: "CVT Trust Exchange",
    tagline: "Long-term vision",
    purpose: "Trusted questions between banks, insurers, employers and logistics — answered without unnecessary personal exposure.",
    status: "concept",
    layer: "platform",
  },
];

export function getFeaturedProducts(): CvtProduct[] {
  return cvtProducts.filter((p) => p.featured);
}

export function getProductsByStatus(status: CvtProductStatus): CvtProduct[] {
  return cvtProducts.filter((p) => p.status === status);
}

export const platformLayers = [
  { label: "Identity", desc: "Registrations linked across categories" },
  { label: "Trust events", desc: "Append-only accountable history" },
  { label: "Verification", desc: "Documents, standing, moderation" },
] as const;
