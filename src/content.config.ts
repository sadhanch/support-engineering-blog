/**
 * ==========================================================
 * SEDS — Content Collection Configuration
 * Purpose:
 * Defines the article loader and validated frontmatter schema.
 *
 * Supported article formats:
 * - Markdown (.md)
 * - MDX (.mdx)
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

        socialImage:
            z.string().optional(),

        summary:
            z.array(z.string()).optional(),

        category: z.string(),

        technology:
            z.array(z.string()),

        references: z.array(

            z.object({

                title: z.string(),

                url: z.string().url(),

                description: z.string()

            })

        ).default([]),

        tags:
            z.array(z.string()),

        publishDate:
            z.date(),

        /**
         * Optional exact publication timestamp.
         *
         * When provided, the article remains unpublished until this
         * timestamp. Existing articles without publishAt remain published
         * according to the existing draft/publishDate behavior.
         */
        publishAt: z.coerce.date().optional(),

        updatedDate:
            z.date().optional(),

        /**
         * Optional date on which the article was last technically reviewed.
         *
         * This is intentionally separate from updatedDate:
         *
         * - updatedDate    = content was changed
         * - reviewedDate   = technical accuracy was reviewed
         *
         * The field is optional so existing articles do not require a
         * fabricated review date.
         */
        reviewedDate:
            z.date().optional(),

        featured:
            z.boolean().default(false),

        draft:
            z.boolean().default(false),

        author:
            z.string()

    })

});


export const collections = {

    articles

};
