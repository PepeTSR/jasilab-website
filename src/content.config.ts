import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const cvtGuides = defineCollection({
  loader: glob({ base: "./src/content/cvt/guides", pattern: "**/*.md" }),
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    order: z.number().default(99),
    /** When false, guide is partner-only and excluded from the public site build */
    public: z.boolean().default(true),
  }),
});

export const collections = { cvtGuides };
