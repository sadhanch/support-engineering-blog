/* ==========================================================
   SEDS — RSS Feed
   ----------------------------------------------------------
   Purpose:
   Generates the site's RSS feed from the published article
   collection.

   Draft articles are already excluded by getAllArticles().
   ========================================================== */

import rss from "@astrojs/rss";

import { getAllArticles } from "../lib/articles";
import { site } from "../config/site";


export async function GET(context) {

    const articles = await getAllArticles();


    return rss({

        title: site.title,

        description: site.description,

        site: context.site,

        items: articles.map(

            (article) => ({

                title: article.data.title,

                description: article.data.excerpt,

                link: `/articles/${article.id}/`,

                pubDate: article.data.publishDate,

                author: article.data.author,

                categories: [

                    ...new Set([

                        article.data.category,

                        ...article.data.technology

                    ])

                ]

            })

        ),

        customData: `

            <language>${site.language}-US</language>

        `

    });

}