// @ts-check

import { defineConfig } from "astro/config";

import mdx from "@astrojs/mdx";
import pagefind from "astro-pagefind";
import sitemap from "@astrojs/sitemap";


/* ==========================================================
   SEDS — Astro Configuration
   Purpose:
   Configures the site URL, content integrations, search,
   sitemap generation, MDX support, and Markdown rendering.
   ==========================================================
*/

export default defineConfig({

    site: "https://blog.sadhan.ch",

    markdown: {

        syntaxHighlight: {

            type: "shiki",

            excludeLangs: [
                "mermaid"
            ]

        },

        shikiConfig: {

            themes: {

                light: "github-light",

                dark: "github-dark"

            },

            defaultColor: false

        }

    },

    integrations: [

        pagefind(),

        sitemap({

            filter: (page) =>
                !page.includes("/search/") &&
                !page.includes("/design-system/")

        }),

        mdx()

    ]

});