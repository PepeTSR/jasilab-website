export type RoadmapPhaseStatus = "live" | "building" | "planned";

export type RoadmapPhase = {
  number: number;
  title: string;
  subtitle?: string;
  status: RoadmapPhaseStatus;
  goal: string;
  features: { label: string; done?: boolean; href?: string }[];
  impact: string;
};

export const trustRoadmapPhases: RoadmapPhase[] = [
  {
    number: 1,
    title: "Vehicle Verification",
    subtitle: "First pilot · Live today",
    status: "live",
    goal: "Know whether a vehicle and driver have been verified.",
    features: [
      { label: "WhatsApp number plate lookup", done: true },
      { label: "Photo lookup", done: true },
      { label: "Verification IDs (CVT-RDR, CVT-TAX, CVT-SPH)", done: true },
      { label: "Public verification responses", done: true },
      { label: "Unknown plates automatically captured", done: true },
      { label: "Boda rider registry", done: true },
      { label: "Taxi and special hire registry", done: true },
    ],
    impact: "Creates the first trusted registry in transport — the template for other service categories.",
  },
  {
    number: 2,
    title: "Incident Reporting",
    status: "live",
    goal: "Build accountability.",
    features: [
      { label: "Public reporting of dangerous driving", done: true },
      { label: "Complaint moderation", done: true, href: "/cvt/guides/moderation-framework" },
      { label: "Evidence collection", done: true },
      { label: "Repeat incident tracking", done: true },
      { label: "Investigation workflows", done: true },
    ],
    impact: "Move beyond identity into accountability.",
  },
  {
    number: 3,
    title: "Trust Profiles",
    subtitle: "Live on cvt.jasilab.net",
    status: "live",
    goal: "Reward good behaviour.",
    features: [
      { label: "Trust Passport", done: true, href: "/cvt/guides/building-a-trust-passport" },
      { label: "Trust Timeline", done: true, href: "/cvt/concepts/trust-timeline" },
      { label: "Trust Levels", done: true, href: "/cvt/concepts/trust-level" },
      { label: "Good Standing", done: true, href: "/cvt/concepts/good-standing" },
      { label: "Training signals", done: true },
      { label: "Insurance signals", done: true, href: "/cvt/guides/insurance" },
      { label: "Verification history", done: true },
      { label: "Clean periods", done: true },
    ],
    impact: "Create portable reputations.",
  },
  {
    number: 4,
    title: "Partner Ecosystem",
    subtitle: "APIs live · partner onboarding in progress",
    status: "building",
    goal: "Allow organisations to consume trust data with consent.",
    features: [
      { label: "Consent framework", done: true, href: "/cvt/guides/consent-framework" },
      { label: "Soft Search", done: true, href: "/cvt/concepts/soft-search" },
      { label: "Enhanced Search", done: true, href: "/cvt/concepts/enhanced-search" },
      { label: "Hard Search (contracted insurers)", done: true, href: "/cvt/concepts/hard-search" },
      { label: "Partner portal and APIs", done: true, href: "/cvt/guides/partner-integration" },
      { label: "Production partner integrations" },
    ],
    impact: "Trust becomes useful beyond verification.",
  },
  {
    number: 5,
    title: "Skills and Opportunity Layer",
    status: "planned",
    goal: "Recognise people, not just vehicles.",
    features: [
      { label: "Education and certificates" },
      { label: "Languages and trade skills" },
      { label: "Employment history", href: "/cvt/guides/employment" },
      { label: "Recommendations" },
    ],
    impact: "Help people access better jobs and opportunities — beyond transport.",
  },
  {
    number: 6,
    title: "Multi-category Registry",
    status: "planned",
    goal: "Expand beyond the transport pilot into other vehicle types and professions.",
    features: [
      { label: "Commercial vehicles (trucks, buses, fleet)", href: "/cvt/roadmap#phases" },
      { label: "Private (non-commercial) vehicle owners", href: "/cvt/roadmap#phases" },
      { label: "Other service professions (plumbers, caregivers, etc.)" },
    ],
    impact: "One identity across multiple roles.",
  },
  {
    number: 7,
    title: "Insurance Network",
    status: "planned",
    goal: "Connect trust to risk pooling.",
    features: [
      { label: "Insurance continuity tracking", href: "/cvt/guides/insurance" },
      { label: "Claims history (partner agreements)" },
      { label: "Underwriting support APIs" },
    ],
    impact: "Lower premiums for trusted drivers.",
  },
  {
    number: 8,
    title: "Financial Inclusion",
    status: "planned",
    goal: "Enable access to credit — carefully and with consent.",
    features: [
      { label: "Financing decision support", href: "/cvt/guides/consent-framework" },
      { label: "Alternative trust signals" },
      { label: "Possible CRB integration (long term, separate programme)" },
    ],
    impact: "Enable access to credit without skipping insurance-first principles.",
  },
];

export const liveTodayItems = [
  {
    title: "WhatsApp verification (transport)",
    body: "Send a number plate to WhatsApp. Receive verification status, vehicle details, and trust indicators. This is the public face of the first pilot.",
  },
  {
    title: "Multi-category transport registry",
    body: "Staff-operated verification for boda riders, taxis and special hire — with public verification IDs such as CVT-RDR-2026-000042.",
  },
  {
    title: "Trust Passport & partner search",
    body: "Public trust passports, consent-gated partner APIs (Soft, Enhanced, Hard Search), and a partner portal on cvt.jasilab.net.",
  },
  {
    title: "Automatic coverage expansion",
    body: "Unknown plates are recorded. Repeated lookups and reports help grow the registry organically.",
  },
  {
    title: "Complaint capture & moderation",
    body: "Reports against vehicles are captured and investigated through two-stage moderation workflows before trust is affected.",
  },
  {
    title: "Registry & trust infrastructure",
    body: "Database, lookup, and trust compute systems are operational on cvt.jasilab.net.",
  },
];

export const siteLayers = [
  { label: "Vision", href: "/cvt/vision", desc: "Why portable trust matters" },
  { label: "First pilot", href: "/cvt#first-pilot", desc: "Commercial transport — live today" },
  { label: "Project Map", href: "/cvt/map", desc: "From pilot to full platform" },
  { label: "Roadmap", href: "/cvt/roadmap", desc: "What's live and what comes next" },
] as const;
