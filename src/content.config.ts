/**
 * ==========================================================
 * SEDS — Content Collection Configuration
 * Purpose: Defines the article collection schema and Markdown loader.
 * ==========================================================
 */

import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const articles = defineCollection({

    loader: glob({

        pattern: "**/*.{md,mdx}",

        base: "./src/content/articles"

    }),

    schema: z.object({

        title: z.string(),

        description: z.string(),

        excerpt: z.string(),

        summary: z.array(z.string()).optional(),

        category: z.string(),

        technology: z.array(z.string()),

        references: z.array(

            z.object({

                title: z.string(),

                url: z.string().url(),

                description: z.string()

            })

        ).default([]),

        tags: z.array(z.string()),

        publishDate: z.date(),

        updatedDate: z.date().optional(),

        featured: z.boolean().default(false),

        draft: z.boolean().default(false),

        author: z.string()

    })

});

export const collections = {

    articles

};