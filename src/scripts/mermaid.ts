type MermaidModule = typeof import("mermaid");

let mermaidInstance:
    MermaidModule["default"] | null = null;

let initialized = false;


/* ==========================================================
   Theme detection
   ========================================================== */

function isDarkTheme(): boolean {

    return (
        document.documentElement.dataset.theme === "dark"
    );

}


/* ==========================================================
   Mermaid theme configuration
   ========================================================== */

function getMermaidConfig() {

    const dark = isDarkTheme();

    return {

        startOnLoad: false,

        securityLevel: "strict" as const,

        theme: "base" as const,

        htmlLabels: true,

        flowchart: {

            useMaxWidth: true,

            wrappingWidth: 320,

            nodeSpacing: 30,

            rankSpacing: 40,

            curve: "linear"

        },

        fontFamily:
            '"Inter", sans-serif',

        themeVariables: dark

            ? {

                background: "#020617",

                primaryColor: "#172033",

                primaryTextColor: "#F8FAFC",

                primaryBorderColor: "#4EA1E0",

                lineColor: "#94A3B8",

                secondaryColor: "#1E293B",

                tertiaryColor: "#0B1120",

                textColor: "#F8FAFC",

                mainBkg: "#172033",

                nodeBorder: "#4EA1E0",

                clusterBkg: "#111827",

                clusterBorder: "#334155",

                edgeLabelBackground: "#111827"

            }

            : {

                background: "#FFFFFF",

                primaryColor: "#F1F5F9",

                primaryTextColor: "#1F2937",

                primaryBorderColor: "#1E73BE",

                lineColor: "#475569",

                secondaryColor: "#E5E7EB",

                tertiaryColor: "#FFFFFF",

                textColor: "#1F2937",

                mainBkg: "#F8FAFC",

                nodeBorder: "#1E73BE",

                clusterBkg: "#F8FAFC",

                clusterBorder: "#CBD5E1",

                edgeLabelBackground: "#FFFFFF"

            }

    };

}


/* ==========================================================
   Lazy load Mermaid
   ----------------------------------------------------------
   Mermaid is downloaded only when the article contains
   Mermaid diagrams.
   ========================================================== */

async function getMermaid() {

    if (!mermaidInstance) {

        const module =
            await import("mermaid");

        mermaidInstance =
            module.default;

    }

    return mermaidInstance;

}


/* ==========================================================
   Convert Mermaid code blocks
   ========================================================== */

function prepareDiagrams(): HTMLElement[] {

    const codeBlocks =
        document.querySelectorAll<HTMLElement>(
            ".article-content pre > code.language-mermaid"
        );

    const diagrams: HTMLElement[] = [];


    codeBlocks.forEach(
        (codeBlock, index) => {

            const pre =
                codeBlock.parentElement;

            if (!pre) {

                return;

            }


            const definition =
                codeBlock.textContent ?? "";

            const diagram =
                document.createElement("div");

            diagram.className =
                "mermaid mermaid-diagram";

            diagram.dataset.definition =
                definition.trim();

            diagram.id =
                `mermaid-diagram-${index + 1}`;

            diagram.setAttribute(
                "role",
                "img"
            );

            diagram.setAttribute(
                "aria-label",
                "Technical diagram"
            );

            diagram.textContent =
                definition.trim();

            pre.replaceWith(diagram);

            diagrams.push(diagram);

        }
    );


    const existing =
        document.querySelectorAll<HTMLElement>(
            ".article-content .mermaid-diagram"
        );


    existing.forEach(
        (diagram) => {

            if (!diagrams.includes(diagram)) {

                diagrams.push(diagram);

            }

        }
    );


    return diagrams;

}


/* ==========================================================
   Render diagrams
   ========================================================== */

async function renderMermaidDiagrams() {

    const diagrams =
        prepareDiagrams();

    if (!diagrams.length) {

        return;

    }


    const mermaid =
        await getMermaid();


    mermaid.initialize(
        getMermaidConfig()
    );

    initialized = true;


    diagrams.forEach(
        (diagram) => {

            const definition =
                diagram.dataset.definition ?? "";

            diagram.innerHTML =
                "";

            diagram.textContent =
                definition;

            diagram.removeAttribute(
                "data-processed"
            );

        }
    );


    await mermaid.run({

        nodes: diagrams,

        suppressErrors: false

    });

}


/* ==========================================================
   Public initialization
   ========================================================== */

export function initializeMermaid() {

    const diagrams =
        document.querySelectorAll(
            ".article-content pre > code.language-mermaid"
        );

    if (!diagrams.length) {

        return;

    }


    void renderMermaidDiagrams();


    window.addEventListener(
        "seb-theme-change",
        () => {

            if (!initialized) {

                return;

            }

            void renderMermaidDiagrams();

        }
    );

}