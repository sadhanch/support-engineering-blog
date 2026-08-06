/**
 * ==========================================================
 * SEDS — Search
 * ----------------------------------------------------------
 * Client-side search initialization.
 * ==========================================================
 */

let pagefind: any = null;

async function getPagefind() {

    if (!pagefind) {

        pagefind = await import("/pagefind/pagefind.js");

        await pagefind.init();

    }

    return pagefind;

}

export async function initializeSearch(): Promise<void> {

    const input = document.querySelector<HTMLInputElement>(
        "#search-input"
    );

    const resultsContainer = document.querySelector<HTMLElement>(
        "#search-results-container"
    );

    const discoveryContainer = document.querySelector<HTMLElement>(
        "#search-discovery-container"
    );

    if (
        !input ||
        !resultsContainer ||
        !discoveryContainer
    ) {

        throw new Error(
            "Search page failed to initialize."
        );

    }

    console.log("Search initialized.");

    const pf = await getPagefind();

    console.log("Pagefind initialized.", pf);

    const search = await pf.search("planner");

    console.log(search);

    console.log("Pagefind initialized.", pf);

}