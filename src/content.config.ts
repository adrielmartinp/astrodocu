import { glob } from "astro/loaders";
import { defineCollection, z } from "astro:content";

const docuCollection = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content" }),
  type: "content_layer",
  schema: z.object({
    url: z.string(),
    nextUrl: z.string().optional(),
    previousUrl: z.string().optional(),
    number: z.number(),
    title: z.string(),
    description: z.string(),
    icon: z.string(),
  }),
});

export const collections = {
  docu: docuCollection,
};
