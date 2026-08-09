/**
 * ==========================================================
 * SEDS — Learning Path Helpers
 * Purpose: Resolves curated Learning Path steps against
 * published articles and calculates aggregate reading time.
 * ==========================================================
 */

import { getAllArticles } from "./articles";

import {
    learningPaths,
    type LearningPath
} from "../data/learning-paths";


/* ==========================================================
   Resolved Learning Path
   ----------------------------------------------------------
   Represents a Learning Path after its article IDs have
   been resolved against the published article collection.
   ========================================================== */

export interface ResolvedLearningPath
    extends Omit<LearningPath, "steps"> {

    steps: Awaited<
        ReturnType<typeof getAllArticles>
    >;

    readingTimeMinutes: number;

    readingTime: string;

}


/* ==========================================================
   Format Reading Time
   ----------------------------------------------------------
   Converts a total number of minutes into a readable
   format for the UI.
   ========================================================== */

function formatReadingTime(
    minutes: number
): string {

    if (minutes < 60) {

        return `${minutes} min reading`;

    }

    const hours = Math.floor(minutes / 60);

    const remainingMinutes = minutes % 60;

    if (remainingMinutes === 0) {

        return `${hours} hr reading`;

    }

    return `${hours} hr ${remainingMinutes} min reading`;

}


/* ==========================================================
   Parse Article Reading Time
   ----------------------------------------------------------
   Article reading times are currently stored as strings,
   for example:

       "8 min read"

   This extracts the numeric minute value.
   ========================================================== */

function parseReadingTime(
    readingTime: string
): number {

    const match = readingTime.match(
        /(\d+)\s*min/
    );

    return match
        ? Number(match[1])
        : 0;

}


/* ==========================================================
   Get All Learning Paths
   ----------------------------------------------------------
   Resolves the article IDs defined in each Learning Path.

   Article order is preserved exactly as defined in
   learning-paths.ts.
   ========================================================== */

export async function getAllLearningPaths(): Promise<
    ResolvedLearningPath[]
> {

    const articles = await getAllArticles();

    const articleMap = new Map(

        articles.map((article) => [
            article.id,
            article
        ])

    );

    return learningPaths.map((path) => {

        const steps = path.steps

            .map((articleId) =>
                articleMap.get(articleId)
            )

            .filter(
                (article): article is typeof articles[number] =>
                    article !== undefined
            );

        const readingTimeMinutes =
            steps.reduce(

                (total, article) =>
                    total +
                    parseReadingTime(
                        article.readingTime
                    ),

                0

            );

        return {

            slug: path.slug,

            title: path.title,

            description: path.description,

            level: path.level,

            steps,

            readingTimeMinutes,

            readingTime:
                formatReadingTime(
                    readingTimeMinutes
                )

        };

    });

}


/* ==========================================================
   Get Published Learning Paths
   ----------------------------------------------------------
   Only Learning Paths containing at least one valid
   published article are returned.
   ========================================================== */

export async function getPublishedLearningPaths() {

    const paths = await getAllLearningPaths();

    return paths.filter(
        (path) => path.steps.length > 0
    );

}


/* ==========================================================
   Get Learning Path By Slug
   ----------------------------------------------------------
   Returns a resolved Learning Path matching the supplied
   slug.
   ========================================================== */

export async function getLearningPathBySlug(
    slug: string
) {

    const paths = await getAllLearningPaths();

    return paths.find(
        (path) => path.slug === slug
    );

}