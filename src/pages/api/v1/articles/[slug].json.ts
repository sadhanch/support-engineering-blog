/**
 * ==========================================================
 * SEB — Mobile Article Detail API
 * ----------------------------------------------------------
 * GET /api/v1/articles/{slug}.json
 * ==========================================================
 */

import type {
    APIRoute,
    GetStaticPaths
} from "astro";

import { render } from "astro:content";

import {
    getAllArticles,
    getArticleBySlug
} from "../../../../lib/articles";

import {
    MOBILE_API_SCHEMA_VERSION,
    toMobileArticleSummary
} from "../../../../lib/mobileApi";

import { site } from "../../../../config/site";


export const getStaticPaths: GetStaticPaths = async () => {

    const articles =
        await getAllArticles();

    return articles.map(
        (article) => ({
            params: {
                slug: article.id
            }
        })
    );
};


export const GET: APIRoute = async ({
    params
}) => {

    const slug =
        params.slug;

    if (!slug) {

        return new Response(
            JSON.stringify({
                error:
                    "Article slug is required."
            }),
            {
                status: 400,

                headers: {
                    "Content-Type":
                        "application/json; charset=utf-8"
                }
            }
        );
    }


    const article =
        await getArticleBySlug(slug);


    if (!article) {

        return new Response(
            JSON.stringify({
                error:
                    "Article not found."
            }),
            {
                status: 404,

                headers: {
                    "Content-Type":
                        "application/json; charset=utf-8"
                }
            }
        );
    }


    const {
        headings
    } = await render(article);


    const summary =
        article.data.summary ?? [];


    const response = {

        schemaVersion:
            MOBILE_API_SCHEMA_VERSION,

        site: {
            name:
                site.title,

            url:
                site.url
        },

        article: {

            ...toMobileArticleSummary(
                article
            ),

            summary,

            references:
                article.data.references,

            headings
        }

    };


    return new Response(
        JSON.stringify(
            response,
            null,
            2
        ),
        {
            status: 200,

            headers: {
                "Content-Type":
                    "application/json; charset=utf-8",

                "Cache-Control":
                    "public, max-age=300, s-maxage=3600"
            }
        }
    );
};