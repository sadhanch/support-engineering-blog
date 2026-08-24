/**
 * ==========================================================
 * Support Engineering Blog
 * Content Health Report
 * ==========================================================
 *
 * Purpose:
 * Provides a read-only editorial health report for the
 * article collection.
 *
 * This script complements:
 *
 *     npm run content:check
 *
 * Content validation answers:
 *     "Is the repository valid?"
 *
 * Content health answers:
 *     "What is the current state of the publication?"
 *
 * The report does not modify files, generate builds, or
 * trigger deployments.
 *
 * Current health areas:
 *
 * - Publication state
 * - Metadata coverage
 * - Category distribution
 * - Technology distribution
 * - Editorial completeness
 *
 * ==========================================================
 */

import fs from "node:fs";
import path from "node:path";
import process from "node:process";


/* ==========================================================
   Repository paths
   ========================================================== */

const ROOT_DIRECTORY =
    process.cwd();

const ARTICLES_DIRECTORY =
    path.join(
        ROOT_DIRECTORY,
        "src",
        "content",
        "articles"
    );


/* ==========================================================
   Date helpers
   ========================================================== */

/**
 * Returns a Date object when the supplied value is a valid
 * date string. Invalid values return null.
 */
function parseDate(
    value
) {

    if (!value) {

        return null;

    }

    const date =
        new Date(value);

    if (
        Number.isNaN(
            date.getTime()
        )
    ) {

        return null;

    }

    return date;

}


/**
 * Returns the calendar date portion of an ISO-style value.
 *
 * This preserves the date written by the author instead of
 * converting a publishAt timestamp into another timezone.
 */
function getCalendarDate(
    value
) {

    if (!value) {

        return null;

    }

    const match =
        value.match(
            /^\d{4}-\d{2}-\d{2}/
        );

    return match
        ? match[0]
        : null;

}


/**
 * Determines whether a scheduled publication has reached
 * its publication timestamp.
 */
function isPublishedBySchedule(
    publishAt
) {

    const date =
        parseDate(
            publishAt
        );

    if (!date) {

        return false;

    }

    return date.getTime()
        <= Date.now();

}


/* ==========================================================
   Frontmatter parser
   ========================================================== */

/**
 * The health report intentionally uses a lightweight
 * frontmatter reader rather than importing Astro's virtual
 * content modules.
 *
 * Astro remains responsible for full schema validation.
 * This script only needs the metadata required for reporting.
 */
function parseFrontmatter(
    content
) {

    const match =
        content.match(
            /^---\r?\n([\s\S]*?)\r?\n---/
        );

    if (!match) {

        return null;

    }

    const frontmatter =
        match[1];


    /**
     * Read a simple scalar frontmatter value.
     */
    const readValue = (
        name
    ) => {

        const expression =
            new RegExp(
                `^${name}:\\s*(?:"([^"]*)"|'([^']*)'|([^\\n#]+))`,
                "m"
            );

        const valueMatch =
            frontmatter.match(
                expression
            );

        if (!valueMatch) {

            return null;

        }

        return (
            valueMatch[1] ??
            valueMatch[2] ??
            valueMatch[3]?.trim() ??
            null
        );

    };


    /**
     * Read a YAML array from a single-line array such as:
     *
     * tags:
     *   - Microsoft 365
     *
     * The multiline form is handled separately below.
     */
    const readArray = (
        name
    ) => {

        const lines =
            frontmatter.split(
                /\r?\n/
            );

        const values = [];

        let collecting =
            false;

        for (
            const line of lines
        ) {

            if (
                new RegExp(
                    `^${name}:\\s*$`
                ).test(line)
            ) {

                collecting = true;

                continue;

            }


            if (
                collecting
            ) {

                const match =
                    line.match(
                        /^\s*-\s*(?:"([^"]*)"|'([^']*)'|(.+))$/
                    );


                if (match) {

                    values.push(
                        (
                            match[1] ??
                            match[2] ??
                            match[3]
                        ).trim()
                    );

                    continue;

                }


                if (
                    line.trim() !== ""
                ) {

                    break;

                }

            }

        }

        return values;

    };


    const technology =
        readArray(
            "technology"
        );

    const tags =
        readArray(
            "tags"
        );

    const summary =
        readArray(
            "summary"
        );


    /**
     * Count simple reference entries.
     *
     * The existing schema stores references as objects, so
     * counting "title:" entries provides a lightweight report
     * without attempting to fully parse nested YAML.
     */
    const references =
        (
            frontmatter.match(
                /^\s*title:/gm
            ) ?? []
        ).length;


    return {

        title:
            readValue("title"),

        category:
            readValue("category"),

        technology,

        tags,

        summary,

        publishDate:
            readValue("publishDate"),

        publishAt:
            readValue("publishAt"),

        updatedDate:
            readValue("updatedDate"),

        draft:
            readValue("draft"),

        socialImage:
            readValue("socialImage"),

        author:
            readValue("author"),

        references

    };

}


/* ==========================================================
   Article discovery
   ========================================================== */

function getArticleFiles() {

    if (
        !fs.existsSync(
            ARTICLES_DIRECTORY
        )
    ) {

        return [];

    }

    return fs
        .readdirSync(
            ARTICLES_DIRECTORY
        )
        .filter(
            (file) =>
                file.endsWith(".md") ||
                file.endsWith(".mdx")
        )
        .sort();

}


/* ==========================================================
   Counter helpers
   ========================================================== */

function increment(
    map,
    key
) {

    const normalized =
        key?.trim();

    if (!normalized) {

        return;

    }

    map.set(
        normalized,
        (map.get(normalized) ?? 0) + 1
    );

}


/* ==========================================================
   Main report
   ========================================================== */

function main() {

    const files =
        getArticleFiles();

    const now =
        new Date();


    /* --------------------------------------------------------
       Publication counters
       -------------------------------------------------------- */

    let publishedCount =
        0;

    let scheduledCount =
        0;

    let draftCount =
        0;


    /* --------------------------------------------------------
       Metadata coverage counters
       -------------------------------------------------------- */

    let socialImageCount =
        0;

    let referencesCount =
        0;

    let technologyCount =
        0;

    let tagsCount =
        0;

    let summaryCount =
        0;

    let updatedDateCount =
        0;


    /* --------------------------------------------------------
       Editorial signal collections
       -------------------------------------------------------- */

    const missingReferences = [];

    const missingSummary = [];

    const missingUpdatedDate = [];


    /* --------------------------------------------------------
       Distribution maps
       -------------------------------------------------------- */

    const categories =
        new Map();

    const technologies =
        new Map();


    /* --------------------------------------------------------
       Article processing
       -------------------------------------------------------- */

    for (
        const file of files
    ) {

        const filePath =
            path.join(
                ARTICLES_DIRECTORY,
                file
            );

        const content =
            fs.readFileSync(
                filePath,
                "utf8"
            );

        const metadata =
            parseFrontmatter(
                content
            );


        if (!metadata) {

            continue;

        }


        const slug =
            file.replace(
                /\.(md|mdx)$/,
                ""
            );


        /* ----------------------------------------------------
           Publication state
           ---------------------------------------------------- */

        if (
            metadata.draft === "true"
        ) {

            draftCount += 1;

        } else if (
            metadata.publishAt
        ) {

            const publishAt =
                parseDate(
                    metadata.publishAt
                );


            if (
                publishAt &&
                publishAt > now
            ) {

                scheduledCount += 1;

            } else {

                publishedCount += 1;

            }

        } else {

            publishedCount += 1;

        }


        /* ----------------------------------------------------
           Metadata coverage
           ---------------------------------------------------- */

        if (
            metadata.socialImage
        ) {

            socialImageCount += 1;

        }


        if (
            metadata.references > 0
        ) {

            referencesCount += 1;

        } else {

            missingReferences.push(
                slug
            );

        }


        if (
            metadata.technology.length > 0
        ) {

            technologyCount += 1;

        }


        if (
            metadata.tags.length > 0
        ) {

            tagsCount += 1;

        }


        if (
            metadata.summary.length > 0
        ) {

            summaryCount += 1;

        } else {

            missingSummary.push(
                slug
            );

        }


        if (
            metadata.updatedDate
        ) {

            updatedDateCount += 1;

        } else {

            missingUpdatedDate.push(
                slug
            );

        }


        /* ----------------------------------------------------
           Distribution
           ---------------------------------------------------- */

        increment(
            categories,
            metadata.category
        );


        for (
            const item of metadata.technology
        ) {

            increment(
                technologies,
                item
            );

        }

    }


    /* ========================================================
       Report helpers
       ======================================================== */

    const percentage =
        (value) => {

            if (!files.length) {

                return "0%";

            }

            return `${Math.round(
                (value / files.length) * 100
            )}%`;

        };


    const printDistribution =
        (
            title,
            map
        ) => {

            console.log(
                ""
            );

            console.log(
                title
            );

            console.log(
                "────────────────────────────"
            );


            const entries =
                [...map.entries()]
                    .sort(
                        (a, b) =>
                            b[1] - a[1] ||
                            a[0].localeCompare(
                                b[0]
                            )
                    );


            if (!entries.length) {

                console.log(
                    "None"
                );

                return;

            }


            for (
                const [
                    name,
                    count
                ] of entries
            ) {

                console.log(
                    `${String(count).padStart(2, " ")}  ${name}`
                );

            }

        };


    /* ========================================================
       Report header
       ======================================================== */

    console.log(
        ""
    );

    console.log(
        "Support Engineering Blog"
    );

    console.log(
        "Content Health Report"
    );

    console.log(
        "════════════════════════════"
    );


    /* ========================================================
       Publication overview
       ======================================================== */

    console.log(
        ""
    );

    console.log(
        "PUBLICATION"
    );

    console.log(
        "────────────────────────────"
    );

    console.log(
        `Total articles       ${files.length}`
    );

    console.log(
        `Published            ${publishedCount}`
    );

    console.log(
        `Scheduled            ${scheduledCount}`
    );

    console.log(
        `Draft                ${draftCount}`
    );


    /* ========================================================
       Metadata coverage
       ======================================================== */

    console.log(
        ""
    );

    console.log(
        "METADATA COVERAGE"
    );

    console.log(
        "────────────────────────────"
    );

    console.log(
        `Social images        ${socialImageCount}/${files.length} (${percentage(socialImageCount)})`
    );

    console.log(
        `References           ${referencesCount}/${files.length} (${percentage(referencesCount)})`
    );

    console.log(
        `Technology metadata  ${technologyCount}/${files.length} (${percentage(technologyCount)})`
    );

    console.log(
        `Tags                 ${tagsCount}/${files.length} (${percentage(tagsCount)})`
    );

    console.log(
        `Summary              ${summaryCount}/${files.length} (${percentage(summaryCount)})`
    );

    console.log(
        `Updated date         ${updatedDateCount}/${files.length} (${percentage(updatedDateCount)})`
    );


    /* ========================================================
       Editorial signals
       ======================================================== */

    console.log(
        ""
    );

    console.log(
        "EDITORIAL SIGNALS"
    );

    console.log(
        "────────────────────────────"
    );

    console.log(
        `Without references   ${missingReferences.length}`
    );

    console.log(
        `Without summary      ${missingSummary.length}`
    );

    console.log(
        `Without updatedDate  ${missingUpdatedDate.length}`
    );


    /* ========================================================
       Distribution reports
       ======================================================== */

    printDistribution(
        "CATEGORIES",
        categories
    );

    printDistribution(
        "TECHNOLOGIES",
        technologies
    );


    /* ========================================================
       Detailed exceptions
       ======================================================== */

    if (
        missingReferences.length
    ) {

        console.log(
            ""
        );

        console.log(
            "ARTICLES WITHOUT REFERENCES"
        );

        console.log(
            "────────────────────────────"
        );

        missingReferences.forEach(
            (slug) =>
                console.log(
                    `- ${slug}`
                )
        );

    }


    if (
        missingSummary.length
    ) {

        console.log(
            ""
        );

        console.log(
            "ARTICLES WITHOUT SUMMARY"
        );

        console.log(
            "────────────────────────────"
        );

        missingSummary.forEach(
            (slug) =>
                console.log(
                    `- ${slug}`
                )
        );

    }


    if (
        missingUpdatedDate.length
    ) {

        console.log(
            ""
        );

        console.log(
            "ARTICLES WITHOUT UPDATED DATE"
        );

        console.log(
            "────────────────────────────"
        );

        missingUpdatedDate.forEach(
            (slug) =>
                console.log(
                    `- ${slug}`
                )
        );

    }


    /* ========================================================
       Completion
       ======================================================== */

    console.log(
        ""
    );

    console.log(
        "REPORT COMPLETE"
    );

    console.log(
        "────────────────────────────"
    );

    console.log(
        `Generated: ${now.toISOString()}`
    );

    console.log(
        ""
    );

    process.exitCode =
        0;

}


main();