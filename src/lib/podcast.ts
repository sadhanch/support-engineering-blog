/**
 * ==========================================================
 * Support Engineering Weekly — Podcast Library
 * ==========================================================
 *
 * Purpose:
 * Provides centralized access to podcast episodes from the
 * Astro content collection.
 *
 * Responsibilities:
 * - Retrieve all podcast episodes.
 * - Sort episodes consistently.
 * - Retrieve a podcast episode by slug.
 * - Retrieve the latest published episode.
 *
 * Page and component code should use these helpers rather
 * than accessing the Astro content collection directly.
 * ==========================================================
 */

import {
    getCollection,
    type CollectionEntry
} from "astro:content";


/* ==========================================================
   Types
   ========================================================== */

export type PodcastEpisode =
    CollectionEntry<"podcast">;


/* ==========================================================
   Get all podcast episodes
   ========================================================== */

export async function getAllPodcastEpisodes(): Promise<
    PodcastEpisode[]
> {

    const episodes =
        await getCollection("podcast");

    return episodes.sort(
        (a, b) => {

            const episodeDifference =
                b.data.episodeNumber -
                a.data.episodeNumber;

            if (
                episodeDifference !== 0
            ) {

                return episodeDifference;

            }

            return (
                b.data.publishDate.getTime() -
                a.data.publishDate.getTime()
            );

        }
    );

}


/* ==========================================================
   Get podcast episode by slug
   ========================================================== */

export async function getPodcastEpisodeBySlug(
    slug: string
): Promise<PodcastEpisode | undefined> {

    const episodes =
        await getCollection("podcast");

    return episodes.find(
        (episode) =>
            episode.id === slug
    );

}


/* ==========================================================
   Get latest podcast episode
   ========================================================== */

export async function getLatestPodcastEpisode(): Promise<
    PodcastEpisode | undefined
> {

    const episodes =
        await getAllPodcastEpisodes();

    return episodes[0];

}