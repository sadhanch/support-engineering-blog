/**
 * ==========================================================
 * SEDS — Tag Data Helpers
 * Purpose: Builds tag listings and tag-filtered article collections.
 * ==========================================================
 */

import { getAllArticles } from "./articles";
import { slugify } from "../utils/slug";

interface Tag {

    name: string;

    slug: string;

    count: number;

}

export async function getAllTags(): Promise<Tag[]> {

    const articles = await getAllArticles();

    const counts = new Map<string, number>();

    for (const article of articles) {

        for (const tag of article.data.tags) {

            counts.set(

                tag,

                (counts.get(tag) ?? 0) + 1

            );

        }

    }

    return [...counts.entries()]

        .map(([name, count]) => ({

            name,

            slug: slugify(name),

            count

        }))

        .sort((a, b) =>

            a.name.localeCompare(b.name)

        );

}

export async function getTagBySlug(
    slug: string
) {

    const tags = await getAllTags();

    return tags.find(

        (tag) => tag.slug === slug

    );

}

export async function getArticlesByTag(
    slug: string
) {

    const articles = await getAllArticles();

    return articles.filter((article) =>

        article.data.tags.some(

            (tag) =>

                slugify(tag) === slug

        )

    );

}