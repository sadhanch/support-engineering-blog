const STORAGE_KEY = "seb-theme";

type Theme = "system" | "light" | "dark";

function getStoredTheme(): Theme {

    const stored =
        localStorage.getItem(STORAGE_KEY);

    if (
        stored === "light" ||
        stored === "dark"
    ) {

        return stored;

    }

    return "system";
}


function applyTheme(theme: Theme) {

    const root =
        document.documentElement;

    if (theme === "dark") {

        root.dataset.theme = "dark";

    } else if (theme === "light") {

        root.dataset.theme = "light";

    } else {

        if (
            window.matchMedia(
                "(prefers-color-scheme: dark)"
            ).matches
        ) {

            root.dataset.theme = "dark";

        } else {

            delete root.dataset.theme;

        }

    }


    window.dispatchEvent(
        new CustomEvent(
            "seb-theme-change"
        )
    );

}


function updateButton(
    button: HTMLButtonElement,
    theme: Theme
) {

    const labels: Record<Theme, string> = {

        system: "Color theme: System",

        light: "Color theme: Light",

        dark: "Color theme: Dark"

    };

    button.setAttribute(
        "aria-label",
        labels[theme]
    );

    button.setAttribute(
        "title",
        labels[theme]
    );

}


export function initializeTheme() {

    const button =
        document.querySelector<HTMLButtonElement>(
            "#theme-toggle"
        );

    if (!button) {

        return;

    }

    let theme =
        getStoredTheme();

    applyTheme(theme);

    updateButton(
        button,
        theme
    );


    button.addEventListener(
        "click",
        () => {

            if (theme === "system") {

                theme = "dark";

            } else if (theme === "dark") {

                theme = "light";

            } else {

                theme = "system";

            }

            localStorage.setItem(
                STORAGE_KEY,
                theme
            );

            applyTheme(theme);

            updateButton(
                button,
                theme
            );

        }
    );


    const mediaQuery =
        window.matchMedia(
            "(prefers-color-scheme: dark)"
        );


    mediaQuery.addEventListener(
        "change",
        () => {

            if (theme === "system") {

                applyTheme("system");

            }

        }
    );

}