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
 * - Taxonomy overlap signals
 * - Low-frequency technology signals
 * - Technical review health
 *
 * Taxonomy findings are advisory only.
 * Review findings are advisory only.
 *
 * The script never changes article metadata automatically.
 *
 * ==========================================================
 */

import fs from "node:fs";
import path from "node:path";
import process from "node:process";

import {
    TECHNOLOGY_TAXONOMY
} from "./config/technology-taxonomy.mjs";


/* ==========================================================
   Review policy
   ----------------------------------------------------------
   Articles older than this many days since their last
   recorded technical review are reported as review
   candidates.
   ========================================================== */

const REVIEW_INTERVAL_DAYS =
    180;


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
   Taxonomy Health
   ========================================================== */

/**
 * Identifies technology labels that belong to an explicitly
 * configured taxonomy group.
 *
 * The analysis is advisory only.
 * No article metadata is modified automatically.
 */
function getTechnologyAliasFindings(
    technologyArticles
) {

    const findings = [];


    for (
        const [
            canonical,
            aliases
        ] of Object.entries(
            TECHNOLOGY_TAXONOMY
        )
    ) {

        const presentAliases =
            aliases.filter(
                (alias) =>
                    technologyArticles.has(
                        alias
                    )
            );


        /*
         * Only report a potential overlap when more than one
         * label from the same taxonomy group is currently used.
         */
        if (
            presentAliases.length < 2
        ) {

            continue;

        }


        const affectedArticles =
            new Set();


        for (
            const alias of
            presentAliases
        ) {

            for (
                const slug of
                technologyArticles.get(
                    alias
                ) ?? []
            ) {

                affectedArticles.add(
                    slug
                );

            }

        }


        findings.push({

            canonical,

            labels:
                presentAliases,

            articles:
                [...affectedArticles]
                    .sort()

        });

    }


    return findings;

}


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


/* ==========================================================
   Frontmatter parser
   ========================================================== */

/**
 * The health report intentionally uses a lightweight
 * frontmatter reader rather than importing Astro's virtual
 * content modules.
 *
 * Astro remains responsible for complete schema validation.
 * This script only reads the metadata required for reporting.
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
     * Read a simple multiline YAML array such as:
     *
     * technology:
     *   - Microsoft 365
     *   - Microsoft Azure
     *
     * This intentionally handles the metadata structure used
     * by the blog rather than attempting to become a full YAML
     * parser.
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


            if (!collecting) {

                continue;

            }


            const match =
                line.match(
                    /^\s*-\s*(?:"([^"]*)"|'([^']*)'|(.+))$/
                );


            if (match) {

                const value = (
                    match[1] ??
                    match[2] ??
                    match[3] ??
                    ""
                ).trim();


                if (value) {

                    values.push(
                        value
                    );

                }

                continue;

            }


            if (
                line.trim() !== ""
            ) {

                break;

            }

        }


        return values;

    };


    /**
     * Count references specifically inside the references
     * block.
     *
     * This avoids accidentally counting the article's own
     * top-level `title:` field as a reference.
     */
    const readReferenceCount = () => {

        const lines =
            frontmatter.split(
                /\r?\n/
            );


        let collecting =
            false;

        let count =
            0;


        for (
            const line of lines
        ) {

            if (
                /^references:\s*$/.test(line)
            ) {

                collecting = true;

                continue;

            }


            if (!collecting) {

                continue;

            }


            if (
                /^\s+-\s+title:\s*/.test(line)
            ) {

                count += 1;

                continue;

            }


            if (
                line.trim() !== "" &&
                !/^\s{2,}/.test(line)
            ) {

                break;

            }

        }


        return count;

    };


    return {

        title:
            readValue("title"),

        category:
            readValue("category"),

        technology:
            readArray("technology"),

        tags:
            readArray("tags"),

        summary:
            readArray("summary"),

        publishDate:
            readValue("publishDate"),

        publishAt:
            readValue("publishAt"),

        updatedDate:
            readValue("updatedDate"),

        reviewedDate:
            readValue("reviewedDate"),

        draft:
            readValue("draft"),

        socialImage:
            readValue("socialImage"),

        author:
            readValue("author"),

        references:
            readReferenceCount()

    };

}


/* ==========================================================
   Review Health
   ========================================================== */

/**
 * Determines whether an article should be considered a
 * technical review candidate.
 *
 * Articles without reviewedDate are intentionally not treated
 * as stale. They are reported separately as "review date not
 * recorded" so that we do not invent review history.
 */
function getReviewCandidate(
    metadata,
    slug,
    now
) {

    if (
        !metadata.reviewedDate
    ) {

        return null;

    }


    const reviewedDate =
        parseDate(
            metadata.reviewedDate
        );


    if (!reviewedDate) {

        return null;

    }


    const ageInDays =
        Math.floor(
            (
                now.getTime() -
                reviewedDate.getTime()
            ) /
            (
                1000 *
                60 *
                60 *
                24
            )
        );


    if (
        ageInDays <
        REVIEW_INTERVAL_DAYS
    ) {

        return null;

    }


    return {

        slug,

        reviewedDate:
            metadata.reviewedDate,

        ageInDays

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


/**
 * Identifies technologies that currently occur only once or
 * twice in the article collection.
 *
 * Low frequency does not mean that the taxonomy is wrong.
 * It simply highlights labels worth reviewing as the
 * publication grows.
 */
function getLowFrequencyTechnologies(
    technologies
) {

    return [
        ...technologies.entries()
    ]

        .filter(
            (
                [
                    ,
                    count
                ]
            ) =>
                count <= 2
        )

        .sort(
            (a, b) =>
                a[1] - b[1] ||
                a[0].localeCompare(
                    b[0]
                )
        );

}


/* ==========================================================
   Report helpers
   ========================================================== */

/**
 * Returns a percentage for a coverage metric.
 */
function formatPercentage(
    value,
    total
) {

    if (!total) {

        return "0%";

    }


    return `${Math.round(
        (value / total) * 100
    )}%`;

}


/**
 * Prints a sorted distribution map.
 *
 * Highest-count values appear first.
 * Equal-count values are alphabetized.
 */
function printDistribution(
    title,
    map
) {

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


    if (
        !entries.length
    ) {

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

    let reviewedDateCount =
        0;


    /* --------------------------------------------------------
       Editorial signal collections
       -------------------------------------------------------- */

    const missingReferences = [];

    const missingSummary = [];

    const missingUpdatedDate = [];

    const missingReviewedDate = [];

    const reviewCandidates = [];


    /* --------------------------------------------------------
       Distribution maps
       -------------------------------------------------------- */

    const categories =
        new Map();


    const technologies =
        new Map();


    /* --------------------------------------------------------
       Technology article index
       --------------------------------------------------------
       Stores the article slugs using each technology so the
       taxonomy report can show exactly which articles are
       affected by a potential overlap.
       -------------------------------------------------------- */

    const technologyArticles =
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


        /*
         * Derive the article slug before any review-health
         * processing so that every report entry has a valid
         * article identifier.
         */
        const slug =
            file.replace(
                /\.(md|mdx)$/,
                ""
            );


        /* ----------------------------------------------------
           Review Health
           ----------------------------------------------------
           Review candidates are calculated only after the
           article metadata and slug are available.
           ---------------------------------------------------- */

        const reviewCandidate =
            getReviewCandidate(
                metadata,
                slug,
                now
            );


        if (
            reviewCandidate
        ) {

            reviewCandidates.push(
                reviewCandidate
            );

        }


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


        if (
            metadata.reviewedDate
        ) {

            reviewedDateCount += 1;

        } else {

            missingReviewedDate.push(
                slug
            );

        }


        /* ----------------------------------------------------
           Category distribution
           ---------------------------------------------------- */

        increment(
            categories,
            metadata.category
        );


        /* ----------------------------------------------------
           Technology distribution and article index
           ---------------------------------------------------- */

        for (
            const item of
            metadata.technology
        ) {

            increment(
                technologies,
                item
            );


            const normalizedTechnology =
                item.trim();


            if (
                !technologyArticles.has(
                    normalizedTechnology
                )
            ) {

                technologyArticles.set(
                    normalizedTechnology,
                    []
                );

            }


            technologyArticles
                .get(
                    normalizedTechnology
                )
                .push(
                    slug
                );

        }

    }


    /* ========================================================
       Taxonomy analysis
       --------------------------------------------------------
       These calculations happen only after every article has
       been processed and the technology maps are complete.
       ======================================================== */

    const taxonomyAliasFindings =
        getTechnologyAliasFindings(
            technologyArticles
        );


    const lowFrequencyTechnologies =
        getLowFrequencyTechnologies(
            technologies
        );


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
        `Social images        ${socialImageCount}/${files.length} (${formatPercentage(
            socialImageCount,
            files.length
        )})`
    );


    console.log(
        `References           ${referencesCount}/${files.length} (${formatPercentage(
            referencesCount,
            files.length
        )})`
    );


    console.log(
        `Technology metadata  ${technologyCount}/${files.length} (${formatPercentage(
            technologyCount,
            files.length
        )})`
    );


    console.log(
        `Tags                 ${tagsCount}/${files.length} (${formatPercentage(
            tagsCount,
            files.length
        )})`
    );


    console.log(
        `Summary              ${summaryCount}/${files.length} (${formatPercentage(
            summaryCount,
            files.length
        )})`
    );


    console.log(
        `Updated date         ${updatedDateCount}/${files.length} (${formatPercentage(
            updatedDateCount,
            files.length
        )})`
    );


    console.log(
        `Reviewed date        ${reviewedDateCount}/${files.length} (${formatPercentage(
            reviewedDateCount,
            files.length
        )})`
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


    console.log(
        `Without reviewedDate ${missingReviewedDate.length}`
    );


    /* ========================================================
       Review Health
       ======================================================== */

    console.log(
        ""
    );


    console.log(
        "REVIEW HEALTH"
    );


    console.log(
        "────────────────────────────"
    );


    console.log(
        `Review interval      ${REVIEW_INTERVAL_DAYS} days`
    );


    console.log(
        `Review dates recorded ${reviewedDateCount}/${files.length} (${formatPercentage(
            reviewedDateCount,
            files.length
        )})`
    );


    console.log(
        `Review candidates    ${reviewCandidates.length}`
    );


    /* --------------------------------------------------------
       Articles due for technical review
       -------------------------------------------------------- */

    if (
        reviewCandidates.length
    ) {

        console.log(
            ""
        );


        console.log(
            "ARTICLES DUE FOR TECHNICAL REVIEW"
        );


        console.log(
            "────────────────────────────"
        );


        reviewCandidates
            .sort(
                (a, b) =>
                    b.ageInDays -
                    a.ageInDays
            )
            .forEach(
                (
                    candidate
                ) => {

                    console.log(
                        `- ${candidate.slug} (${candidate.ageInDays} days since review)`
                    );

                }
            );

    }


    /* --------------------------------------------------------
       Articles without recorded technical review
       -------------------------------------------------------- */

    if (
        missingReviewedDate.length
    ) {

        console.log(
            ""
        );


        console.log(
            "ARTICLES WITHOUT A RECORDED TECHNICAL REVIEW"
        );


        console.log(
            "────────────────────────────"
        );


        missingReviewedDate.forEach(
            (slug) =>
                console.log(
                    `- ${slug}`
                )
        );

    }


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
       Taxonomy Health
       ======================================================== */

    console.log(
        ""
    );


    console.log(
        "TAXONOMY HEALTH"
    );


    console.log(
        "────────────────────────────"
    );


    /* --------------------------------------------------------
       Potential technology overlaps
       -------------------------------------------------------- */

    console.log(
        ""
    );


    console.log(
        "POTENTIAL TECHNOLOGY OVERLAPS"
    );


    console.log(
        "────────────────────────────"
    );


    if (
        !taxonomyAliasFindings.length
    ) {

        console.log(
            "None detected."
        );

    } else {

        for (
            const finding of
            taxonomyAliasFindings
        ) {

            console.log(
                `⚠ ${finding.canonical}`
            );


            console.log(
                `  Labels: ${finding.labels.join(" ↔ ")}`
            );


            console.log(
                `  Articles affected: ${finding.articles.length}`
            );

        }

    }


    /* --------------------------------------------------------
       Low-frequency technologies
       -------------------------------------------------------- */

    console.log(
        ""
    );


    console.log(
        "LOW-FREQUENCY TECHNOLOGIES"
    );


    console.log(
        "────────────────────────────"
    );


    if (
        !lowFrequencyTechnologies.length
    ) {

        console.log(
            "None detected."
        );

    } else {

        for (
            const [
                technology,
                count
            ] of lowFrequencyTechnologies
        ) {

            console.log(
                `- ${technology} (${count} article${
                    count === 1
                        ? ""
                        : "s"
                })`
            );

        }

    }


    /* --------------------------------------------------------
       Taxonomy review candidates
       -------------------------------------------------------- */

    if (
        taxonomyAliasFindings.length
    ) {

        console.log(
            ""
        );


        console.log(
            "TAXONOMY REVIEW CANDIDATES"
        );


        console.log(
            "────────────────────────────"
        );


        for (
            const finding of
            taxonomyAliasFindings
        ) {

            console.log(
                ""
            );


            console.log(
                `${finding.canonical}:`
            );


            for (
                const alias of
                finding.labels
            ) {

                const articles =
                    technologyArticles.get(
                        alias
                    ) ?? [];


                console.log(
                    `  ${alias}`
                );


                for (
                    const slug of
                    articles
                ) {

                    console.log(
                        `    - ${slug}`
                    );

                }

            }

        }

    }


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