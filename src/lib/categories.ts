/**
 * ==========================================================
 * SEDS — Category Data Helpers
 * Purpose: Builds category listings from editorial category
 * configuration and the published article collection.
 * ==========================================================
 */

import { getAllArticles } from "./articles";

import { categories } from "../data/categories";

import { slugify } from "../utils/slug";


/* ==========================================================
   Category Result
   ----------------------------------------------------------
   Represents a category as it will be consumed by the UI.
   ========================================================== */

export interface CategoryResult {

    name: string;

    description: string;

    slug: string;

    count: number;

    featured: boolean;

    order: number;

}


/* ==========================================================
   Get All Categories
   ----------------------------------------------------------
   Combines:

   1. Editorial category configuration
   2. Published article counts

   Draft articles are automatically excluded because
   getAllArticles() only returns published articles.
   ========================================================== */

export async function getAllCategories(): Promise<CategoryResult[]> {

    const articles = await getAllArticles();

    const counts = new Map<string, number>();


    /* ------------------------------------------------------
       Count published articles by category.
       ------------------------------------------------------ */

    for (const article of articles) {

        const category = article.data.category;

        counts.set(

            category,

            (counts.get(category) ?? 0) + 1

        );

    }


    /* ------------------------------------------------------
       Combine editorial category data with article counts.

       Categories with no published articles are excluded
       from the returned list.
       ------------------------------------------------------ */

    return categories

        .map((category) => ({

            name: category.title,

            description: category.description,

            slug:
                category.slug ||
                slugify(category.title),

            count:
                counts.get(category.title) ?? 0,

            featured: category.featured,

            order: category.order

        }))

        .filter(
            (category) =>
                category.count > 0
        )

        .sort(
            (a, b) =>
                a.order - b.order
        );

}


/* ==========================================================
   Get Featured Categories
   ----------------------------------------------------------
   Returns only categories intentionally selected for
   homepage presentation.
   ========================================================== */

export async function getFeaturedCategories() {

    const categories = await getAllCategories();

    return categories.filter(
        (category) =>
            category.featured
    );

}


/* ==========================================================
   Get Category By Slug
   ----------------------------------------------------------
   Used by category pages to resolve a category URL.
   ========================================================== */

export async function getCategoryBySlug(
    slug: string
) {

    const categories = await getAllCategories();

    return categories.find(
        (category) =>
            category.slug === slug
    );

}


/* ==========================================================
   Get Articles By Category
   ----------------------------------------------------------
   Returns published articles belonging to a category.
   ========================================================== */

export async function getArticlesByCategory(
    slug: string
) {

    const articles = await getAllArticles();

    return articles.filter(

        (article) =>

            slugify(article.data.category) === slug

    );

}