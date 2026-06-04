import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const cvtDocs = defineCollection({
  loader: glob({ base: "./src/content/cvt/docs", pattern: "**/*.md" }),
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    version: z.string().optional(),
    order: z.number().default(99),
  }),
});

export const collections = { cvtDocs };
