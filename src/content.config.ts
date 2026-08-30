/**
 * ==========================================================
 * SEDS — Content Collection Configuration
 * Purpose:
 * Defines the article and podcast content collections
 * and their validated frontmatter schemas.
 *
 * Supported article formats:
 * - Markdown (.md)
 * - MDX (.mdx)
 *
 * Supported podcast formats:
 * - Markdown (.md)
 * - MDX (.mdx)
 * ==========================================================
 */

import { defineCollection, z } from "astro:content";

import { glob } from "astro/loaders";


/* ==========================================================
   Articles
   ========================================================== */

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


/* ==========================================================
   Podcast
   ========================================================== */

const podcast = defineCollection({

    loader: glob({

        pattern: "**/*.{md,mdx}",

        base: "./src/content/podcast"

    }),

    schema: z.object({

        /**
         * Sequential episode number.
         *
         * Stored as an integer so the presentation layer can
         * format it as Episode 001, Episode 002, etc.
         */
        episodeNumber:
            z.number().int().positive(),

        /**
         * Optional season number.
         *
         * Seasons are supported by the content model but are
         * not required to be exposed in the initial UI.
         */
        season:
            z.number().int().positive().optional(),

        title:
            z.string(),

        description:
            z.string(),

        publishDate:
            z.date(),

        /**
         * Publicly accessible production audio.
         *
         * The actual archival master is intentionally NOT stored
         * in the website repository.
         */
        audio: z.object({

            url:
                z.string().url(),

            mimeType:
                z.string(),

            duration:
                z.number().int().positive()

        }),

        /**
         * Optional relationship to an existing Support Engineering
         * Blog article.
         *
         * This should contain the article content ID/slug.
         */
        relatedArticle:
            z.string().optional(),

        /**
         * Optional technical resources associated with the episode.
         */
        resources: z.array(

            z.object({

                title:
                    z.string(),

                url:
                    z.string().url()

            })

        ).default([]),

        /**
         * Optional human-readable transcript resource.
         */
        transcript:
            z.string().optional(),

        /**
         * Optional timed-caption resource in WebVTT format.
         */
        captions:
            z.string().optional()

    })

});


/* ==========================================================
   Exported Collections
   ========================================================== */

export const collections = {

    articles,

    podcast

};