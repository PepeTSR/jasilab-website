import { cvtPath } from "./site";

/** Shared narrative copy — CVT as a product; transport is the first live vertical. */

export const cvtPlatformTagline = "Trust. Visibility. Accountability.";

export const cvtProductName = "Connected Verification Terminal";

export const cvtLiveLabel = "Live in Kampala";

export const cvtPilotLabel = "Commercial transport";

export const cvtPilotSummary =
  "CVT is operational in Kampala with boda riders, taxis and special hire. WhatsApp plate lookup, staff-operated verification, Trust Passport, and incident reporting are live — proving the model before it extends to other service providers.";

export function getCvtJourneySteps() {
  return [
    {
      step: "01",
      title: "Vision",
      desc: "Why portable trust matters for Uganda, Africa and informal economies.",
      href: cvtPath("vision"),
    },
    {
      step: "02",
      title: "What's live",
      desc: "Commercial transport in Kampala — plates, riders, WhatsApp lookup.",
      href: cvtPath("#whats-live"),
    },
    {
      step: "03",
      title: "Trust layer",
      desc: "Profiles, timelines and passports — reputation that travels with you.",
      href: cvtPath("#trust-infrastructure"),
    },
    {
      step: "04",
      title: "Roadmap",
      desc: "Skills, new categories, insurance and inclusion — where CVT goes next.",
      href: cvtPath("roadmap"),
    },
  ];
}

export const cvtPilotCapabilities = [
  "WhatsApp plate lookup",
  "Boda, taxi & special hire registry",
  "Trust Passport & partner search",
  "Public incident reporting",
] as const;
