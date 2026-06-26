/** Shared homepage copy — keep all cvt.co.ug themes in sync. */

export type CvtHowItWorksStep = {
  title: string;
  body: string;
};

export const cvtHowItWorksSteps: CvtHowItWorksStep[] = [
  {
    title: "Verify",
    body: "Approved staff register people and assets, verify documents and maintain an auditable registry — today for boda, taxi and special hire in Kampala.",
  },
  {
    title: "Lookup",
    body: "Anyone checks verification status on channels people already use. WhatsApp plate lookup is live; unknown plates are captured into the network.",
  },
  {
    title: "Build trust",
    body: "Standing grows from verified history, training, insurance and conduct. Complaints only affect trust after moderation — not raw accusations.",
  },
  {
    title: "Share with consent",
    body: "Workers share Trust Profiles with employers, fleets or insurers. Individuals control what is disclosed and to whom.",
  },
  {
    title: "Reward good behaviour",
    body: "Long-term reputation and rehabilitation over punishment. Trust is explainable and evolves from verified facts.",
  },
];

export const cvtTrustEarned = [
  "Verification",
  "Time",
  "Training",
  "Insurance",
  "Good conduct",
] as const;

export const cvtTrustPassportLead =
  "Not a hidden score — a passport built from verified facts. Today's transport registry feeds the trust layer that will serve other service providers.";
