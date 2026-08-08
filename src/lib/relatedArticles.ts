/**
 * ==========================================================
 * SEDS — Related Article Logic
 * Purpose: Scores and selects related articles using category, technology, and tag overlap.
 * ==========================================================
 */

import type { CollectionEntry } from "astro:content";

type Article = CollectionEntry<"articles"> & {
    readingTime: string;
    formattedDate: string;
};

export function getRelatedArticles(
    currentArticle: Article,
    allArticles: Article[],
    limit = 3
) {

    return allArticles
        .filter((article) => article.id !== currentArticle.id)
        .map((article) => {

            let score = 0;

            // Same category
            if (
                article.data.category ===
                currentArticle.data.category
            ) {
                score += 1;
            }

            // Shared technologies
            const sharedTechnology =
                article.data.technology.filter((item) =>
                    currentArticle.data.technology.includes(item)
                ).length;

            score += sharedTechnology * 3;

            // Shared tags
            const sharedTags =
                article.data.tags.filter((tag) =>
                    currentArticle.data.tags.includes(tag)
                ).length;

            score += sharedTags * 2;

            return {

                article,

                score

            };

        })
        .filter(({ score }) => score > 0)
        .sort((a, b) => b.score - a.score)
        .slice(0, limit)
        .map(({ article }) => article);

}