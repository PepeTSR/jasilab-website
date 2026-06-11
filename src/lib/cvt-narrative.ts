/** Shared narrative copy — platform vision with transport as the first pilot. */

export const cvtPlatformTagline = "Trust. Visibility. Accountability.";

export const cvtPilotLabel = "First pilot: commercial transport";

export const cvtPilotSummary =
  "CVT is live in Kampala with boda bodas, taxis and special hire. WhatsApp plate lookup, rider verification and incident reporting are the entry point — proving the model before it extends to other service providers.";

export const cvtJourneySteps = [
  {
    step: "01",
    title: "Vision",
    desc: "Why portable trust matters for Uganda, Africa and informal economies.",
    href: "/cvt/vision",
  },
  {
    step: "02",
    title: "First pilot",
    desc: "Commercial transport in Kampala — plates, riders, WhatsApp lookup.",
    href: "/cvt#first-pilot",
  },
  {
    step: "03",
    title: "Trust layer",
    desc: "Profiles, timelines and passports — reputation that travels with you.",
    href: "/cvt#trust-infrastructure",
  },
  {
    step: "04",
    title: "Roadmap",
    desc: "Skills, new categories, insurance and inclusion — where it goes next.",
    href: "/cvt/roadmap",
  },
] as const;

export const cvtPilotCapabilities = [
  "WhatsApp plate lookup",
  "Rider & vehicle verification",
  "Public incident reporting",
  "Trust profiles (in progress)",
] as const;
