import { defineCollection, z } from "astro:content";

const articles = defineCollection({

    schema: z.object({

        title: z.string(),

        description: z.string(),

        category: z.string(),

        tags: z.array(z.string()),

        publishDate: z.date(),

        updatedDate: z.date().optional(),

        readingTime: z.number(),

        featured: z.boolean().default(false),

        draft: z.boolean().default(false),

        author: z.string()

    })

});

export const collections = {

    articles

};