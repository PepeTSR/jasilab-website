import { getCollection, type CollectionEntry } from "astro:content";

export type CvtGuide = CollectionEntry<"cvtGuides">;

export function isPublicGuide(guide: CvtGuide): boolean {
  return guide.data.public !== false;
}

export async function getPublicGuides(): Promise<CvtGuide[]> {
  const guides = await getCollection("cvtGuides");
  return guides.filter(isPublicGuide).sort((a, b) => (a.data.order ?? 99) - (b.data.order ?? 99));
}
