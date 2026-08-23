/**
 * Support Engineering Blog
 * ========================
 * Scheduled Publication Checker
 *
 * Purpose:
 * Determines whether the current repository contains an approved article
 * whose publishAt timestamp has been reached but whose public article URL
 * is not yet available.
 *
 * The script does not modify repository files and does not trigger a
 * deployment itself. It only exits with a status that GitHub Actions can
 * use to decide whether Cloudflare should rebuild the site.
 *
 * Publication rules:
 * - draft === true
 *     → never publish
 * - no publishAt
 *     → existing article behavior; nothing scheduled to trigger
 * - publishAt > now
 *     → not yet due
 * - publishAt <= now
 *     → publication is due
 *
 * Production check:
 * A due article is considered already published when its production
 * article URL returns a successful HTTP response.
 */

import fs from "node:fs";
import path from "node:path";
import process from "node:process";

const ARTICLES_DIRECTORY = path.resolve(
  "src",
  "content",
  "articles",
);

const SITE_ORIGIN = "https://blog.sadhan.ch";

const now = new Date();

function parseFrontmatter(content) {
  const match = content.match(
    /^---\r?\n([\s\S]*?)\r?\n---/,
  );

  if (!match) {
    return null;
  }

  const frontmatter = match[1];

  const readValue = (name) => {
    const expression = new RegExp(
      `^${name}:\\s*(?:"([^"]*)"|'([^']*)'|([^\\n#]+))`,
      "m",
    );

    const valueMatch =
      frontmatter.match(expression);

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

  const draftValue = readValue("draft");
  const publishAtValue =
    readValue("publishAt");

  const draft =
    draftValue === "true";

  const publishAt =
    publishAtValue
      ? new Date(publishAtValue)
      : null;

  return {
    draft,
    publishAt,
  };
}

function getArticleFiles() {
  return fs
    .readdirSync(ARTICLES_DIRECTORY)
    .filter(
      (file) =>
        file.endsWith(".md") ||
        file.endsWith(".mdx"),
    );
}

async function isArticlePublished(slug) {
  const url =
    `${SITE_ORIGIN}/articles/${slug}/`;

  try {
    const response = await fetch(url, {
        method: "GET",
        redirect: "follow",
        signal: AbortSignal.timeout(10000),
    });

    return response.ok;
  } catch {
    return false;
  }
}

async function main() {
  const files = getArticleFiles();

  const pendingArticles = [];

  for (const file of files) {
    const filePath =
      path.join(
        ARTICLES_DIRECTORY,
        file,
      );

    const content =
      fs.readFileSync(
        filePath,
        "utf8",
      );

    const metadata =
      parseFrontmatter(content);

    if (!metadata) {
      continue;
    }

    if (metadata.draft) {
      continue;
    }

    if (!metadata.publishAt) {
      continue;
    }

    if (
      Number.isNaN(
        metadata.publishAt.getTime(),
      )
    ) {
      console.warn(
        `Skipping ${file}: invalid publishAt value.`,
      );

      continue;
    }

    if (
      metadata.publishAt > now
    ) {
      continue;
    }

    const slug =
      file.replace(
        /\.(md|mdx)$/,
        "",
      );

    const published =
      await isArticlePublished(
        slug,
      );

    if (!published) {
      pendingArticles.push({
        file,
        slug,
        publishAt:
          metadata.publishAt.toISOString(),
      });
    }
  }

  if (!pendingArticles.length) {
    console.log(
      "No scheduled publications are waiting for deployment.",
    );

    /**
     * Allow Node to shut down normally rather than terminating the
     * process immediately. This avoids interrupting pending asynchronous
     * resources on platforms such as Windows.
     *
     * Exit code 0 = no deployment required.
     */
    process.exitCode = 0;
    return;
  }

  console.log(
    "Scheduled publications waiting for deployment:",
  );

  for (const article of pendingArticles) {
    console.log(
      `- ${article.slug} (${article.publishAt})`,
    );
  }

  /**
   * GitHub Actions uses this exit code to decide whether to call
   * the Cloudflare Deploy Hook.
   *
   * Exit code 10 = deployment required.
   *
   * Set the exit code instead of calling process.exit() so Node can
   * finish closing asynchronous resources normally.
   */
  process.exitCode = 10;
  return;
}

main().catch((error) => {
  console.error(
    "Scheduled publication check failed.",
    error,
  );

  /**
   * Exit code 1 = the publication check itself failed.
   *
   * The process is allowed to shut down normally so any outstanding
   * asynchronous resources can close cleanly.
   */
  process.exitCode = 1;
});