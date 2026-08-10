// @ts-check

import { defineConfig } from "astro/config";

import pagefind from "astro-pagefind";
import sitemap from "@astrojs/sitemap";


import mdx from "@astrojs/mdx";


// https://astro.build/config

export default defineConfig({

    site: "https://blog.sadhan.ch",

    integrations: [pagefind(), sitemap({

        filter: (page) => {

            return !page.includes("/search/")
                && !page.includes("/design-system/");

        }

    }), mdx()],

});