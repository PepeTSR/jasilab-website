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
 /** Show on /platform/ product shelves (live / pilot / building). Horizon items stay off this page. */
 platformShelf?: boolean;
 href?: string;
 external?: boolean;
};

export const cvtPlatformStatement =
 "CVT is public trust infrastructure - enabling people, organisations and assets to build, verify and share trusted identities and accountable histories.";

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
 purpose:
 "Create trusted, verifiable identities for people providing services - registration, documents, complaints and public lookup.",
 status: "live",
 layer: "registry",
 featured: true,
 platformShelf: true,
 href: `${cvtAppUrl}/lookup`,
 external: true,
 },
 {
 id: "connect",
 name: "CVT Connect",
 tagline: "The communications layer",
 purpose:
 "Trusted interactions through channels people already use - WhatsApp plate lookup today, with contact and dispatch integrations as they mature.",
 status: "live",
 layer: "connect",
 featured: true,
 platformShelf: true,
 href: cvtWhatsAppUrl,
 external: true,
 },
 {
 id: "passport",
 name: "CVT Passport",
 tagline: "Portable professional identity",
 purpose:
 "A public, consent-aware view of verified registry facts - standing, tenure and milestones. Training and insurance signals appear as they are verified.",
 status: "live",
 layer: "trust",
 featured: true,
 platformShelf: true,
 href: cvtPath("guides/building-a-trust-passport"),
 },
 {
 id: "enterprise",
 name: "CVT Enterprise",
 tagline: "For employers and fleets",
 purpose:
 "Partner workspaces for fleet roster, consent-based screening, compliance and pilot programmes - org-scoped, not a public data dump.",
 status: "pilot",
 layer: "enterprise",
 platformShelf: true,
 href: cvtEnterpriseUrl,
 external: true,
 },
 {
 id: "api",
 name: "CVT API",
 tagline: "For developers and partners",
 purpose:
 "Partner lookup APIs under agreement - credentials, consent and declared purpose required.",
 status: "building",
 layer: "enterprise",
 platformShelf: true,
 href: cvtPath("partners"),
 },
 {
 id: "identity",
 name: "CVT Identity",
 tagline: "Person-centric spine",
 purpose:
 "One CVT ID that links roles and registrations for the same person - base identity expanding beyond a single vehicle category.",
 status: "building",
 layer: "platform",
 platformShelf: true,
 },
 {
 id: "trace",
 name: "CVT Trace",
 tagline: "Supply chain trust events",
 purpose:
 "Chain-of-custody trust events for goods and distributions - longer-horizon platform idea, not a public product shelf.",
 status: "concept",
 layer: "registry",
 },
 {
 id: "insights",
 name: "CVT Insights",
 tagline: "Aggregated intelligence",
 purpose:
 "Lookup trends, complaint hotspots and service demand - without exposing personal data.",
 status: "planned",
 layer: "data",
 },
 {
 id: "learn",
 name: "CVT Learn",
 tagline: "Professional development",
 purpose:
 "Courses and certificates that improve Trust Profiles - road safety, customer service, financial literacy.",
 status: "planned",
 layer: "trust",
 },
 {
 id: "protect",
 name: "CVT Protect",
 tagline: "Verified incident records",
 purpose:
 "Lost property, theft references and insurance incidents - controlled disclosure, not a public blacklist.",
 status: "planned",
 layer: "trust",
 },
 {
 id: "circles",
 name: "CVT Circles",
 tagline: "Community finance signals",
 purpose:
 "Digital rotating savings groups that generate contribution history and financial trust signals - not a savings product.",
 status: "concept",
 layer: "data",
 },
 {
 id: "exchange",
 name: "CVT Trust Exchange",
 tagline: "Long-term vision",
 purpose:
 "Trusted questions between banks, insurers, employers and logistics - answered without unnecessary personal exposure.",
 status: "concept",
 layer: "platform",
 },
];

export function getFeaturedProducts(): CvtProduct[] {
 return cvtProducts.filter((p) => p.featured);
}

export function getPlatformShelfProducts(): CvtProduct[] {
 return cvtProducts.filter((p) => p.platformShelf);
}

export function getHorizonProducts(): CvtProduct[] {
 return cvtProducts.filter((p) => p.status === "planned" || p.status === "concept");
}

export function getProductsByStatus(status: CvtProductStatus): CvtProduct[] {
 return cvtProducts.filter((p) => p.status === status);
}

export const platformLayers = [
 { label: "Identity", desc: "Registrations linked across categories" },
 { label: "Trust events", desc: "Append-only accountable history" },
 { label: "Verification", desc: "Documents, standing, moderation" },
] as const;
