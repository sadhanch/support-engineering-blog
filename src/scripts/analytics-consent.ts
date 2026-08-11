/*
==========================================================
SEDS — Analytics Consent
Purpose: Manages visitor consent for optional analytics.
==========================================================
*/

const CONSENT_KEY = "seb-analytics-consent";

type ConsentState = "granted" | "denied";


function getConsent(): ConsentState | null {

    const stored =
        localStorage.getItem(CONSENT_KEY);

    if (
        stored === "granted" ||
        stored === "denied"
    ) {

        return stored;

    }

    return null;

}


function saveConsent(
    state: ConsentState
) {

    localStorage.setItem(
        CONSENT_KEY,
        state
    );

}


function loadGoogleAnalytics() {

    const measurementId =
        document.documentElement.dataset.gaId;

    if (!measurementId) {

        console.warn(
            "SEDS: Google Analytics Measurement ID is not configured."
        );

        return;

    }


    if (
        document.querySelector(
            'script[data-seb-analytics]'
        )
    ) {

        return;

    }


    const script =
        document.createElement("script");

    script.async = true;

    script.src =
        `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;

    script.dataset.sebAnalytics = "true";

    document.head.appendChild(script);


    window.dataLayer =
        window.dataLayer || [];


    function gtag() {

        window.dataLayer.push(arguments);

    }


    window.gtag = gtag;


    gtag(
        "js",
        new Date()
    );


    gtag(
        "config",
        measurementId
    );

}


function hideBanner(
    banner: HTMLElement
) {

    banner.hidden = true;

}


function showBanner(
    banner: HTMLElement
) {

    banner.hidden = false;

}


export function initializeAnalyticsConsent() {

    const banner =
        document.querySelector<HTMLElement>(
            "#consent-banner"
        );


    if (!banner) {

        return;

    }


    const accept =
        document.querySelector<HTMLButtonElement>(
            "#consent-accept"
        );


    const decline =
        document.querySelector<HTMLButtonElement>(
            "#consent-decline"
        );


    if (!accept || !decline) {

        return;

    }


    const consent =
        getConsent();


    if (consent === "granted") {

        hideBanner(banner);

        loadGoogleAnalytics();

    } else if (consent === "denied") {

        hideBanner(banner);

    } else {

        showBanner(banner);

    }


    accept.addEventListener(
        "click",
        () => {

            saveConsent("granted");

            hideBanner(banner);

            loadGoogleAnalytics();

        }
    );


    decline.addEventListener(
        "click",
        () => {

            saveConsent("denied");

            hideBanner(banner);

        }
    );

}