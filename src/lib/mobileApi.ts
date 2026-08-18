/**
 * ==========================================================
 * SEB — Mobile Content API Helpers
 * ----------------------------------------------------------
 * Purpose:
 * Provides stable, app-facing representations of article
 * metadata for the Support Engineering Blog mobile client.
 * ==========================================================
 */

import type { CollectionEntry } from "astro:content";

import { site } from "../config/site";

export const MOBILE_API_SCHEMA_VERSION = 1;

export type MobileArticleSummary = {
    id: string;
    title: string;
    description: string;
    excerpt: string;

    category: string;
    technology: string[];
    tags: string[];

    author: string;

    publishedAt: string;
    updatedAt: string | null;

    readingTimeMinutes: number;

    featured: boolean;

    canonicalUrl: string;
    contentUrl: string;
};

export type MobileArticleDetail = MobileArticleSummary & {
    summary: string[];

    references: {
        title: string;
        url: string;
        description: string;
    }[];

    headings: {
        depth: number;
        slug: string;
        text: string;
    }[];
};

function toIsoDate(date: Date | undefined): string | null {
    return date?.toISOString() ?? null;
}

function toReadingTimeMinutes(readingTime: string): number {
    const match = readingTime.match(/\d+/);

    return match
        ? Number.parseInt(match[0], 10)
        : 0;
}

export function toMobileArticleSummary(
    article: CollectionEntry<"articles">
): MobileArticleSummary {

    return {
        id: article.id,

        title:
            article.data.title,

        description:
            article.data.description,

        excerpt:
            article.data.excerpt,

        category:
            article.data.category,

        technology:
            article.data.technology,

        tags:
            article.data.tags,

        author:
            article.data.author,

        publishedAt:
            article.data.publishDate.toISOString(),

        updatedAt:
            toIsoDate(article.data.updatedDate),

        readingTimeMinutes:
            toReadingTimeMinutes(article.readingTime),

        featured:
            article.data.featured,

        canonicalUrl:
            `${site.url}/articles/${article.id}/`,

        contentUrl:
            `${site.url}/api/v1/articles/${article.id}.html`
    };
}