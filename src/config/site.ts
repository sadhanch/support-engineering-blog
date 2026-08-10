/**
 * ==========================================================
 * SEDS — Site Configuration
 * Purpose:
 * Central source for site identity, navigation, footer links,
 * and SEO metadata.
 * ==========================================================
 */

export const site = {

    title:
        "Support Engineering Blog",

    shortTitle:
        "SEB",

    description:
        "Technical documentation, Microsoft 365 administration, and support engineering resources.",

    url:
        "https://blog.sadhan.ch",

    author:
        "Sadhan Chandra",

    language:
        "en",

    themeColor:
        "#0F172A",

    seo: {

        defaultImage:
            "/og-cover.png"

    },

    navigation: [

        {
            label: "Articles",
            href: "/articles"
        },

        {
            label: "Topics",
            href: "/topics"
        },

        {
            label: "Learning Paths",
            href: "/learning-paths"
        },

        {
            label: "About",
            href: "/about"
        }

    ],

    footer: {

        explore: [

            {
                label: "Articles",
                href: "/articles"
            },

            {
                label: "Topics",
                href: "/topics"
            },

            {
                label: "Learning Paths",
                href: "/learning-paths"
            },

            {
                label: "About",
                href: "/about"
            }

        ],

        resources: [

            {
                label: "Search",
                href: "/search"
            },

            {
                label: "RSS",
                href: "/rss.xml"
            },

            {
                label: "GitHub",
                href: "https://github.com/sadhanch/"
            }

        ],

        legal: [

            {
                label: "Privacy",
                href: "/privacy"
            },

            {
                label: "Terms",
                href: "/terms"
            }

        ]

    }

};
