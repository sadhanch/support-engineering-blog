/**
 * ==========================================================
 * SEDS — Technology Data Helpers
 * Purpose: Builds technology listings and technology-filtered article collections.
 * ==========================================================
 */

import { getAllArticles } from "./articles";
import { slugify } from "../utils/slug";

interface Technology {

    name: string;

    slug: string;

    count: number;

}

export async function getAllTechnologies(): Promise<Technology[]> {

    const articles = await getAllArticles();

    const counts = new Map<string, number>();

    for (const article of articles) {

        for (const technology of article.data.technology) {

            counts.set(

                technology,

                (counts.get(technology) ?? 0) + 1

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

export async function getTechnologyBySlug(
    slug: string
) {

    const technologies = await getAllTechnologies();

    return technologies.find(

        (technology) => technology.slug === slug

    );

}

export async function getArticlesByTechnology(
    slug: string
) {

    const articles = await getAllArticles();

    return articles.filter((article) =>

        article.data.technology.some(

            (technology) =>

                slugify(technology) === slug

        )

    );

}