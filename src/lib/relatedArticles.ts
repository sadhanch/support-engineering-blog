/**
 * ==========================================================
 * SEDS — Related Article Logic
 * Purpose: Scores and selects related articles using
 * category, technology, and tag overlap.
 * ==========================================================
 */

import type { CollectionEntry } from "astro:content";

type Article = CollectionEntry<"articles"> & {
    readingTime: string;
    formattedDate: string;
};


/* ==========================================================
   Related Article Scoring
   ----------------------------------------------------------
   These weights define how strongly each taxonomy relationship
   influences the Recommended Reading results.

   Technology → strongest relationship
   Tags       → conceptual relationship
   Category   → broad relationship
   ========================================================== */

const CATEGORY_WEIGHT = 1;

const TECHNOLOGY_WEIGHT = 3;

const TAG_WEIGHT = 2;


/* ==========================================================
   Get Related Articles
   ========================================================== */

export function getRelatedArticles(
    currentArticle: Article,
    allArticles: Article[],
    limit = 3
) {

    return allArticles

        /* --------------------------------------------------
           Exclude the article currently being viewed.
           -------------------------------------------------- */

        .filter(
            (article) =>
                article.id !== currentArticle.id
        )

        /* --------------------------------------------------
           Calculate a relevance score for every remaining
           article.
           -------------------------------------------------- */

        .map((article) => {

            let score = 0;


            /* ------------------------------------------------
               Same Category
               Broadest relationship.
               ------------------------------------------------ */

            if (
                article.data.category ===
                currentArticle.data.category
            ) {

                score += CATEGORY_WEIGHT;

            }


            /* ------------------------------------------------
               Shared Technologies
               Strongest relationship.
               ------------------------------------------------ */

            const sharedTechnology =
                article.data.technology.filter(
                    (item) =>
                        currentArticle.data.technology.includes(item)
                ).length;

            score +=
                sharedTechnology *
                TECHNOLOGY_WEIGHT;


            /* ------------------------------------------------
               Shared Tags
               Conceptual relationship.
               ------------------------------------------------ */

            const sharedTags =
                article.data.tags.filter(
                    (tag) =>
                        currentArticle.data.tags.includes(tag)
                ).length;

            score +=
                sharedTags *
                TAG_WEIGHT;


            return {

                article,

                score

            };

        })

        /* --------------------------------------------------
           Articles with no meaningful relationship are
           excluded.
           -------------------------------------------------- */

        .filter(
            ({ score }) =>
                score > 0
        )

        /* --------------------------------------------------
           Sort by relevance first.

           If two articles have the same relevance score,
           prefer the more recently published article.
           -------------------------------------------------- */

        .sort((a, b) => {

            if (b.score !== a.score) {

                return b.score - a.score;

            }

            return (
                b.article.data.publishDate.getTime() -
                a.article.data.publishDate.getTime()
            );

        })

        /* --------------------------------------------------
           Limit the number of recommendations.
           -------------------------------------------------- */

        .slice(0, limit)

        /* --------------------------------------------------
           Return the original article objects expected by
           the RelatedArticles component.
           -------------------------------------------------- */

        .map(
            ({ article }) =>
                article
        );

}