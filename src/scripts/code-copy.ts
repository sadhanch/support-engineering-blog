/**
 * ==========================================================
 * Support Engineering Blog — Code Copy
 * File: code-copy.ts
 * Purpose: Adds accessible copy controls and language labels to article code blocks.
 * ==========================================================
 */

const COPY_RESET_DELAY = 2000;


const LANGUAGE_LABELS: Record<string, string> = {

    bash: "Bash",

    shell: "Shell",

    sh: "Shell",

    powershell: "PowerShell",

    ps1: "PowerShell",

    javascript: "JavaScript",

    js: "JavaScript",

    typescript: "TypeScript",

    ts: "TypeScript",

    json: "JSON",

    yaml: "YAML",

    yml: "YAML",

    xml: "XML",

    html: "HTML",

    css: "CSS",

    sql: "SQL",

    kql: "KQL",

    csharp: "C#",

    cs: "C#",

    java: "Java",

    python: "Python",

    py: "Python",

    markdown: "Markdown",

    md: "Markdown",

    text: "Text",

    plaintext: "Text"

};


function formatLanguageLabel(
    language: string | null
): string {

    if (!language) {

        return "Code";

    }


    const normalized =
        language.toLowerCase().trim();


    if (
        LANGUAGE_LABELS[normalized]
    ) {

        return LANGUAGE_LABELS[normalized];

    }


    return normalized
        .split(/[-_]/)
        .map(
            (word) =>
                word.charAt(0).toUpperCase() +
                word.slice(1)
        )
        .join(" ");

}


function createToolbar(
    pre: HTMLPreElement
): HTMLDivElement {

    const toolbar =
        document.createElement("div");

    toolbar.className =
        "code-block-toolbar";


    const language =
        formatLanguageLabel(
            pre.dataset.language
        );


    const label =
        document.createElement("span");

    label.className =
        "code-language";

    label.textContent =
        language;

    label.setAttribute(
        "aria-hidden",
        "true"
    );


    const button =
        document.createElement("button");

    button.type =
        "button";

    button.className =
        "code-copy-button";

    button.textContent =
        "Copy";

    button.setAttribute(
        "aria-label",
        `Copy ${language} code`
    );


    toolbar.appendChild(
        label
    );

    toolbar.appendChild(
        button
    );


    return toolbar;

}


async function copyCode(
    code: string
): Promise<boolean> {

    try {

        await navigator.clipboard.writeText(
            code
        );

        return true;

    } catch {

        return false;

    }

}


function setupCodeCopyButtons() {

    const codeBlocks =
        document.querySelectorAll<HTMLPreElement>(
            ".article-content pre"
        );


    codeBlocks.forEach(
        (pre) => {

            if (
                pre.dataset.copyInitialized === "true"
            ) {

                return;

            }


            const code =
                pre.querySelector("code");


            if (!code) {

                return;

            }


            if (
                code.classList.contains(
                    "language-mermaid"
                )
            ) {

                return;

            }


            pre.dataset.copyInitialized =
                "true";


            pre.classList.add(
                "code-block--copyable"
            );


            const toolbar =
                createToolbar(pre);


            const button =
                toolbar.querySelector<HTMLButtonElement>(
                    ".code-copy-button"
                );


            if (!button) {

                return;

            }


            button.addEventListener(
                "click",
                async () => {

                    const success =
                        await copyCode(
                            code.textContent ?? ""
                        );


                    if (!success) {

                        button.textContent =
                            "Copy failed";

                        button.setAttribute(
                            "aria-label",
                            "Copy failed"
                        );


                        window.setTimeout(
                            () => {

                                button.textContent =
                                    "Copy";

                                button.setAttribute(
                                    "aria-label",
                                    `Copy ${
                                        formatLanguageLabel(
                                            pre.dataset.language
                                        )
                                    } code`
                                );

                            },
                            COPY_RESET_DELAY
                        );

                        return;

                    }


                    button.textContent =
                        "Copied ✓";

                    button.setAttribute(
                        "aria-label",
                        "Code copied"
                    );


                    window.setTimeout(
                        () => {

                            button.textContent =
                                "Copy";

                            button.setAttribute(
                                "aria-label",
                                `Copy ${
                                    formatLanguageLabel(
                                        pre.dataset.language
                                    )
                                } code`
                            );

                        },
                        COPY_RESET_DELAY
                    );

                }
            );


            pre.appendChild(
                toolbar
            );

        }
    );

}


export function initializeCodeCopy() {

    if (
        !document.querySelector(
            ".article-content pre code"
        )
    ) {

        return;

    }


    setupCodeCopyButtons();

}