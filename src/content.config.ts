import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const cvtGuides = defineCollection({
  loader: glob({ base: "./src/content/cvt/guides", pattern: "**/*.md" }),
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    order: z.number().default(99),
  }),
});

export const collections = { cvtGuides };
