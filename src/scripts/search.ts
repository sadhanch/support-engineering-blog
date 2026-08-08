/**
 * ==========================================================
 * SEDS — Search Controller
 * Purpose: Initializes Pagefind, renders results, highlights matches, and handles keyboard result navigation.
 * ==========================================================
 */

/**
 * ==========================================================
 * SEDS — Search
 * ----------------------------------------------------------
 * Client-side search initialization.
 * ==========================================================
 */

let pagefind: any = null;

let searchTimeout: ReturnType<typeof setTimeout> | null = null;

let activeResultIndex = -1;


/* ==========================================================
   Pagefind
   ========================================================== */

async function getPagefind() {

    if (!pagefind) {

        const pagefindPath = "/pagefind/pagefind.js";

        pagefind = await import(
            /* @vite-ignore */
            pagefindPath
        );

        await pagefind.init();

    }

    return pagefind;

}


/* ==========================================================
   HTML Safety
   ========================================================== */

function escapeHtml(value: string): string {

    return value
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#39;");

}


/* ==========================================================
   Search Highlighting
   ========================================================== */

function highlightQuery(
    value: string,
    query: string
): string {

    if (!value || !query.trim()) {

        return escapeHtml(value);

    }

    const terms = query
        .trim()
        .split(/\s+/)
        .filter(Boolean);

    if (terms.length === 0) {

        return escapeHtml(value);

    }

    const pattern = new RegExp(
        `(${terms
            .map((term) =>
                term.replace(
                    /[.*+?^${}()|[\]\\]/g,
                    "\\$&"
                )
            )
            .join("|")})`,
        "gi"
    );

    const parts = value.split(pattern);

    return parts
        .map((part) => {

            const isMatch = terms.some(
                (term) =>
                    part.toLowerCase() === term.toLowerCase()
            );

            if (isMatch) {

                return `<mark>${escapeHtml(part)}</mark>`;

            }

            return escapeHtml(part);

        })
        .join("");

}


/* ==========================================================
   Search Result
   ========================================================== */

function createSearchResult(
    page: any,
    query: string
): string {

    const category = page.meta.category ?? "";
    const readingTime = page.meta.reading_time ?? "";
    const title = page.meta.title ?? "";
    const description = page.meta.description ?? "";

    const metadata: string[] = [];

    if (category) {

        metadata.push(
            escapeHtml(category)
        );

    }

    if (readingTime) {

        metadata.push(
            escapeHtml(readingTime)
        );

    }

    return `

        <article class="search-result-item">

            <a
                href="${escapeHtml(page.url)}"
                class="search-result-item__title"
            >

                ${highlightQuery(title, query)}

            </a>

            ${
                metadata.length > 0
                    ? `
                        <div class="search-result-item__meta">

                            ${metadata.join(" • ")}

                        </div>
                    `
                    : ""
            }

            <p class="search-result-item__excerpt">

                ${highlightQuery(
                    description,
                    query
                )}

            </p>

        </article>

    `;

}


/* ==========================================================
   Render Results
   ========================================================== */

function renderResults(
    container: HTMLElement,
    pages: any[],
    query: string
): void {

    container.innerHTML = pages
        .map((page) =>
            createSearchResult(page, query)
        )
        .join("");

    activeResultIndex = -1;

}


/* ==========================================================
   Result Navigation
   ========================================================== */

function getResults(
    resultsContainer: HTMLElement
): HTMLElement[] {

    return Array.from(
        resultsContainer.querySelectorAll<HTMLElement>(
            ".search-result-item"
        )
    );

}


function setActiveResult(
    resultsContainer: HTMLElement,
    index: number
): void {

    const results = getResults(resultsContainer);

    if (results.length === 0) {

        activeResultIndex = -1;

        return;

    }

    results.forEach((result) => {

        result.classList.remove(
            "search-result-item--active"
        );

    });

    activeResultIndex = index;

    const active = results[activeResultIndex];

    if (!active) {

        return;

    }

    active.classList.add(
        "search-result-item--active"
    );

    active.scrollIntoView({
        block: "nearest",
        behavior: "smooth"
    });

}


function moveToNextResult(
    resultsContainer: HTMLElement
): void {

    const results = getResults(resultsContainer);

    if (results.length === 0) {

        return;

    }

    const nextIndex =
        activeResultIndex === -1
            ? 0
            : (activeResultIndex + 1) % results.length;

    setActiveResult(
        resultsContainer,
        nextIndex
    );

}


function moveToPreviousResult(
    resultsContainer: HTMLElement
): void {

    const results = getResults(resultsContainer);

    if (results.length === 0) {

        return;

    }

    const previousIndex =
        activeResultIndex === -1
            ? results.length - 1
            : (
                activeResultIndex - 1 + results.length
            ) % results.length;

    setActiveResult(
        resultsContainer,
        previousIndex
    );

}


/* ==========================================================
   Perform Search
   ========================================================== */

async function performSearch(
    query: string,
    pf: any,
    resultsContainer: HTMLElement,
    discoveryContainer: HTMLElement,
    statusContainer: HTMLElement
): Promise<void> {

    const trimmedQuery = query.trim();

    if (!trimmedQuery) {

        resultsContainer.hidden = true;

        resultsContainer.innerHTML = "";

        statusContainer.hidden = true;

        statusContainer.textContent = "";

        discoveryContainer.hidden = false;

        activeResultIndex = -1;

        return;

    }

    const search = await pf.search(trimmedQuery);

    const pages = await Promise.all(

        search.results.map(
            (result: any) => result.data()
        )

    );

    if (pages.length === 0) {

        statusContainer.hidden = true;

        resultsContainer.innerHTML = `

            <div class="search-empty">

                <h2>

                    No articles found

                </h2>

                <p>

                    Try another keyword or browse the technologies below.

                </p>

            </div>

        `;

        resultsContainer.hidden = false;

        discoveryContainer.hidden = false;

        activeResultIndex = -1;

        return;

    }

    statusContainer.hidden = false;

    statusContainer.textContent =
        `Found ${pages.length} result${pages.length === 1 ? "" : "s"} for "${trimmedQuery}"`;

    renderResults(
        resultsContainer,
        pages,
        trimmedQuery
    );

    resultsContainer.hidden = false;

    discoveryContainer.hidden = true;

}


/* ==========================================================
   Debounced Search
   ========================================================== */

function debounceSearch(
    query: string,
    pf: any,
    resultsContainer: HTMLElement,
    discoveryContainer: HTMLElement,
    statusContainer: HTMLElement
): void {

    if (searchTimeout) {

        clearTimeout(searchTimeout);

    }

    searchTimeout = setTimeout(async () => {

        await performSearch(
            query,
            pf,
            resultsContainer,
            discoveryContainer,
            statusContainer
        );

    }, 250);

}


/* ==========================================================
   Keyboard Navigation
   ========================================================== */

function initializeResultKeyboardNavigation(
    input: HTMLInputElement,
    resultsContainer: HTMLElement
): void {

    input.addEventListener("keydown", (event) => {

        const results = getResults(
            resultsContainer
        );

        if (results.length === 0) {

            return;

        }

        switch (event.key) {

            case "ArrowDown":

                event.preventDefault();

                moveToNextResult(
                    resultsContainer
                );

                break;


            case "ArrowUp":

                event.preventDefault();

                moveToPreviousResult(
                    resultsContainer
                );

                break;


            case "Enter": {

                event.preventDefault();

                const targetIndex =
                    activeResultIndex >= 0
                        ? activeResultIndex
                        : 0;

                const target =
                    results[targetIndex];

                target
                    ?.querySelector<HTMLAnchorElement>("a")
                    ?.click();

                break;

            }

        }

    });

}


/* ==========================================================
   Initialization
   ========================================================== */

export async function initializeSearch(): Promise<void> {

    const input =
        document.querySelector<HTMLInputElement>(
            "#search-input"
        );

    const resultsContainer =
        document.querySelector<HTMLElement>(
            "#search-results-container"
        );

    const discoveryContainer =
        document.querySelector<HTMLElement>(
            "#search-discovery-container"
        );

    const statusContainer =
        document.querySelector<HTMLElement>(
            "#search-status"
        );

    if (
        !input ||
        !resultsContainer ||
        !discoveryContainer ||
        !statusContainer
    ) {

        throw new Error(
            "Search page failed to initialize."
        );

    }

    console.log("Search initialized.");

    const pf = await getPagefind();

    console.log("Pagefind initialized.");

    await performSearch(
        "",
        pf,
        resultsContainer,
        discoveryContainer,
        statusContainer
    );

    input.addEventListener("input", () => {

        debounceSearch(
            input.value,
            pf,
            resultsContainer,
            discoveryContainer,
            statusContainer
        );

    });

    initializeResultKeyboardNavigation(
        input,
        resultsContainer
    );

}