/**
 * ==========================================================
 * SEDS — Slug Utilities
 * ----------------------------------------------------------
 * Generates canonical URL-friendly slugs used throughout
 * the documentation platform.
 *
 * All pages should use these helpers instead of implementing
 * their own slug logic.
 * ==========================================================
 */

export function slugify(value: string): string {

    return value
        .trim()
        .toLowerCase()
        .replace(/&/g, " and ")
        .replace(/[^\w\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-")
        .replace(/^-|-$/g, "");

}

export function deslugify(slug: string): string {

    return slug
        .replace(/-/g, " ")
        .replace(/\b\w/g, (letter) =>
            letter.toUpperCase()
        );

}

export function isSlug(
    value: string
): boolean {

    return value === slugify(value);

}