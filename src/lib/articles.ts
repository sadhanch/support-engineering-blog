/**
 * ==========================================================
 * SEDS — Article Data Helpers
 * Purpose: Loads, filters, sorts, and enriches article content.
 * ==========================================================
 */

import { getCollection } from "astro:content";

import { calculateReadingTime } from "../utils/content";

function enrichArticle(article: Awaited<ReturnType<typeof getCollection<"articles">>>[number]) {

    return {

        ...article,

        readingTime: calculateReadingTime(article.body),

        formattedDate:
            article.data.updatedDate?.toLocaleDateString(
                "en-IN",
                {
                    day: "numeric",
                    month: "short",
                    year: "numeric"
                }
            ) ?? ""

    };

}

export async function getAllArticles() {

    const articles = await getCollection(
        "articles",
        ({ data }) => !data.draft
    );

    return articles
        .sort(
            (a, b) =>
                b.data.publishDate.getTime() -
                a.data.publishDate.getTime()
        )
        .map(enrichArticle);

}

export async function getFeaturedArticles() {

    const articles = await getAllArticles();

    return articles.filter(
        ({ data }) => data.featured
    );

}

export async function getLatestArticles(limit = 4) {

    const articles = await getAllArticles();

    return articles.slice(0, limit);

}

export async function getHomepageArticles(limit = 4) {

    const featured = await getFeaturedArticles();

    if (featured.length > 0) {

        return {

            title: "Featured Articles",

            description:
                "Hand-picked research and guides recommended by the editorial team.",

            articles: featured

        };

    }

    return {

        title: "Latest Articles",

        description:
            "Recently published research-backed articles for Microsoft 365 administrators and support engineers.",

        articles: await getLatestArticles(limit)

    };

}

export async function getArticleBySlug(slug: string) {

    const articles = await getAllArticles();

    return articles.find(
        (article) => article.id === slug
    );

}