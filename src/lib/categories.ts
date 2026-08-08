/**
 * ==========================================================
 * SEDS — Category Data Helpers
 * Purpose: Builds category listings and category-filtered article collections.
 * ==========================================================
 */

import { getAllArticles } from "./articles";
import { slugify } from "../utils/slug";

interface Category {

    name: string;

    slug: string;

    count: number;

}

export async function getAllCategories(): Promise<Category[]> {

    const articles = await getAllArticles();

    const counts = new Map<string, number>();

    for (const article of articles) {

        const category = article.data.category;

        counts.set(

            category,

            (counts.get(category) ?? 0) + 1

        );

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

export async function getCategoryBySlug(
    slug: string
) {

    const categories = await getAllCategories();

    return categories.find(

        (category) => category.slug === slug

    );

}

export async function getArticlesByCategory(
    slug: string
) {

    const articles = await getAllArticles();

    return articles.filter(

        (article) =>

            slugify(article.data.category) === slug

    );

}