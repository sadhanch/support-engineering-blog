/**
 * Support Engineering Blog
 * ========================
 * Content Quality Validator
 *
 * Purpose:
 * Performs repository-level validation for article content before
 * the Astro build or a production deployment.
 *
 * Validation philosophy:
 * - Errors block the workflow.
 * - Warnings are reported for editorial review but do not block it.
 *
 * Current checks:
 * - Required frontmatter fields are present.
 * - publishDate is valid.
 * - publishAt is valid when present.
 * - draft is a valid boolean when present.
 * - socialImage exists and points to a file in /public.
 * - Internal article links point to known article slugs.
 * - Duplicate article slugs are rejected.
 *
 * The validator intentionally does not duplicate Astro's complete
 * schema validation. Astro remains the source of truth for schema
 * validation; this script adds publication-oriented checks that are
 * useful to run independently and in CI.
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

const PUBLIC_DIRECTORY =
    path.join(
        ROOT_DIRECTORY,
        "public"
    );


/* ==========================================================
   Validation state
   ========================================================== */

const errors = [];
const warnings = [];


/* ==========================================================
   Frontmatter parser
   ----------------------------------------------------------
   This intentionally remains lightweight. Astro's content
   schema remains responsible for complete frontmatter parsing
   and type validation.
   ========================================================== */

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


    return {

        title:
            readValue("title"),

        description:
            readValue("description"),

        excerpt:
            readValue("excerpt"),

        socialImage:
            readValue("socialImage"),

        category:
            readValue("category"),

        publishDate:
            readValue("publishDate"),

        updatedDate:
            readValue("updatedDate"),

        reviewedDate:
            readValue("reviewedDate"),

        publishAt:
            readValue("publishAt"),

        draft:
            readValue("draft"),

        author:
            readValue("author")

    };

}


/* ==========================================================
   Utility helpers
   ========================================================== */

function addError(
    file,
    message
) {

    errors.push(
        `${file}: ${message}`
    );

}


function addWarning(
    file,
    message
) {

    warnings.push(
        `${file}: ${message}`
    );

}


function isValidDate(
    value
) {

    if (!value) {

        return false;

    }

    const date =
        new Date(value);

    return !Number.isNaN(
        date.getTime()
    );

}

/**
 * Returns the calendar date portion of an ISO-style date value.
 *
 * For publishAt, this intentionally preserves the calendar date
 * written by the author rather than converting the timestamp to UTC.
 * This keeps the validation aligned with the author's stated
 * publication date and timezone.
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


function normalizePublicPath(
    value
) {

    if (!value) {

        return null;

    }

    if (!value.startsWith("/")) {

        return null;

    }

    return path.join(
        PUBLIC_DIRECTORY,
        value.replace(
            /^\/+/,
            ""
        )
    );

}


/* ==========================================================
   Discover article files
   ========================================================== */

function getArticleFiles() {

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
   Check required metadata
   ========================================================== */

function validateRequiredMetadata(
    file,
    metadata
) {

    const requiredFields = [
        "title",
        "description",
        "excerpt",
        "category",
        "publishDate",
        "author"
    ];


    for (
        const field of requiredFields
    ) {

        if (!metadata[field]) {

            addError(
                file,
                `missing required field "${field}".`
            );

        }

    }

}


/* ==========================================================
   Check publication metadata
   ========================================================== */

function validatePublicationMetadata(
    file,
    metadata
) {

    if (
        metadata.publishDate &&
        !isValidDate(
            metadata.publishDate
        )
    ) {

        addError(
            file,
            `publishDate is not a valid date: "${metadata.publishDate}".`
        );

    }


    if (
        metadata.publishAt &&
        !isValidDate(
            metadata.publishAt
        )
    ) {

        addError(
            file,
            `publishAt is not a valid timestamp: "${metadata.publishAt}".`
        );

    }


    if (
        metadata.publishAt &&
        !/[zZ]|[+-]\d{2}:\d{2}$/.test(
            metadata.publishAt
        )
    ) {

        addError(
            file,
            `publishAt must include an explicit timezone offset or Z: "${metadata.publishAt}".`
        );

    }

    if (
        metadata.reviewedDate &&
        !isValidDate(
            metadata.reviewedDate
        )
    ) {

        addError(
            file,
            `reviewedDate is not a valid date: "${metadata.reviewedDate}".`
        );

    }


    /**
     * Ensure the exact publication timestamp does not precede
     * the article's editorial publication date.
     *
     * The comparison intentionally uses calendar dates rather
     * than full timestamp comparison because publishDate is an
     * editorial date while publishAt represents an exact instant.
     *
     * Rules:
     * - publishAt date earlier than publishDate
     *     → ERROR
     * - publishAt date equal to publishDate
     *     → valid
     * - publishAt date later than publishDate
     *     → WARNING
     */
    if (
        metadata.publishDate &&
        metadata.publishAt &&
        isValidDate(
            metadata.publishDate
        ) &&
        isValidDate(
            metadata.publishAt
        )
    ) {

        const publishDate =
            getCalendarDate(
                metadata.publishDate
            );

        const publishAtDate =
            getCalendarDate(
                metadata.publishAt
            );


        if (
            publishDate &&
            publishAtDate &&
            publishAtDate < publishDate
        ) {

            addError(
                file,
                `publishAt date (${publishAtDate}) cannot be earlier than publishDate (${publishDate}).`
            );

        } else if (
            publishDate &&
            publishAtDate &&
            publishAtDate > publishDate
        ) {

            addWarning(
                file,
                `publishAt date (${publishAtDate}) is later than publishDate (${publishDate}).`
            );

        }

    }


    if (
        metadata.draft &&
        ![
            "true",
            "false"
        ].includes(
            metadata.draft
        )
    ) {

        addError(
            file,
            `draft must be true or false, received "${metadata.draft}".`
        );

    }

}


/* ==========================================================
   Check social image
   ========================================================== */

function validateSocialImage(
    file,
    metadata
) {

    if (!metadata.socialImage) {

        addError(
            file,
            "missing socialImage."
        );

        return;

    }


    const publicPath =
        normalizePublicPath(
            metadata.socialImage
        );

    if (!publicPath) {

        addError(
            file,
            `socialImage must be a public-root path beginning with "/": "${metadata.socialImage}".`
        );

        return;

    }


    if (
        !fs.existsSync(
            publicPath
        )
    ) {

        addError(
            file,
            `socialImage file does not exist: "${metadata.socialImage}".`
        );

    }

}


/* ==========================================================
   Check internal article links
   ========================================================== */

function collectArticleSlugs(
    articleFiles
) {

    return new Set(
        articleFiles.map(
            (file) =>
                file.replace(
                    /\.(md|mdx)$/,
                    ""
                )
        )
    );

}


function validateInternalLinks(
    file,
    content,
    articleSlugs
) {

    const links = [
        ...content.matchAll(
            /\]\((\/articles\/[^)#?\s]+)\/?\)/g
        )
    ];


    for (
        const match of links
    ) {

        const linkedPath =
            match[1];

        const slug =
            linkedPath
                .replace(
                    /^\/articles\//,
                    ""
                )
                .replace(
                    /\/$/,
                    ""
                );


        if (
            !articleSlugs.has(
                slug
            )
        ) {

            addError(
                file,
                `internal article link points to an unknown article: "${linkedPath}".`
            );

        }

    }

}


/* ==========================================================
   Check duplicate slugs
   ========================================================== */

function validateDuplicateSlugs(
    articleFiles
) {

    const seen =
        new Map();

    for (
        const file of articleFiles
    ) {

        const slug =
            file.replace(
                /\.(md|mdx)$/,
                ""
            );

        if (
            seen.has(
                slug
            )
        ) {

            addError(
                file,
                `duplicate article slug "${slug}" also exists in "${seen.get(slug)}".`
            );

        } else {

            seen.set(
                slug,
                file
            );

        }

    }

}


/* ==========================================================
   Editorial warnings
   ========================================================== */

function validateEditorialWarnings(
    file,
    metadata
) {

    if (
        metadata.title &&
        metadata.title.length > 110
    ) {

        addWarning(
            file,
            `title is ${metadata.title.length} characters long.`
        );

    }


    if (
        metadata.description &&
        metadata.description.length > 180
    ) {

        addWarning(
            file,
            `description is ${metadata.description.length} characters long.`
        );

    }


    if (!metadata.category) {

        return;

    }

}


/* ==========================================================
   Main validation
   ========================================================== */

function main() {

    if (
        !fs.existsSync(
            ARTICLES_DIRECTORY
        )
    ) {

        console.error(
            `Article directory not found: ${ARTICLES_DIRECTORY}`
        );

        process.exitCode = 1;

        return;

    }


    const articleFiles =
        getArticleFiles();


    const articleSlugs =
        collectArticleSlugs(
            articleFiles
        );


    validateDuplicateSlugs(
        articleFiles
    );


    for (
        const file of articleFiles
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

            addError(
                file,
                "frontmatter block is missing or malformed."
            );

            continue;

        }


        validateRequiredMetadata(
            file,
            metadata
        );


        validatePublicationMetadata(
            file,
            metadata
        );


        validateSocialImage(
            file,
            metadata
        );


        validateInternalLinks(
            file,
            content,
            articleSlugs
        );


        validateEditorialWarnings(
            file,
            metadata
        );

    }


    console.log(
        ""
    );

    console.log(
        "Support Engineering Blog"
    );

    console.log(
        "Content Quality Check"
    );

    console.log(
        "────────────────────────────"
    );

    console.log(
        `Articles checked: ${articleFiles.length}`
    );

    console.log(
        `Errors: ${errors.length}`
    );

    console.log(
        `Warnings: ${warnings.length}`
    );


    if (errors.length) {

        console.log(
            ""
        );

        console.log(
            "ERRORS"
        );

        for (
            const error of errors
        ) {

            console.log(
                `✗ ${error}`
            );

        }

    }


    if (warnings.length) {

        console.log(
            ""
        );

        console.log(
            "WARNINGS"
        );

        for (
            const warning of warnings
        ) {

            console.log(
                `⚠ ${warning}`
            );

        }

    }


    console.log(
        ""
    );


    if (errors.length) {

        console.log(
            "STATUS"
        );

        console.log(
            "✗ FAIL"
        );

        process.exitCode = 1;

        return;

    }


    console.log(
        "STATUS"
    );

    console.log(
        "✓ PASS"
    );

    process.exitCode = 0;

}


main();