/**
 * ==========================================================
 * SEDS — Global Search Shortcuts
 * Purpose:
 * Handles Ctrl+K and / shortcuts that focus or open search.
 * ==========================================================
 */

function focusSearch(): void {

    const input = document.querySelector<HTMLInputElement>(
        "#search-input"
    );

    if (!input) {

        window.location.href = "/search";

        return;

    }

    input.focus();

    input.select();

}

export function initializeGlobalSearch(): void {

    document.addEventListener("keydown", (event) => {

        // Ctrl + K
        if (event.ctrlKey && event.key.toLowerCase() === "k") {

            event.preventDefault();

            focusSearch();

        }

        // /
        if (
            event.key === "/" &&
            !(event.target instanceof HTMLInputElement) &&
            !(event.target instanceof HTMLTextAreaElement)
        ) {

            event.preventDefault();

            focusSearch();

        }

    });

}