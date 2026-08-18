/**
 * ==========================================================
 * SEB — Mobile Article Catalogue API
 * ----------------------------------------------------------
 * GET /api/v1/articles.json
 * ==========================================================
 */

import type { APIRoute } from "astro";

import { getAllArticles } from "../../../lib/articles";
import {
    MOBILE_API_SCHEMA_VERSION,
    toMobileArticleSummary
} from "../../../lib/mobileApi";

import { site } from "../../../config/site";

export const GET: APIRoute = async () => {

    const articles =
        await getAllArticles();

    const response = {
        schemaVersion:
            MOBILE_API_SCHEMA_VERSION,

        generatedAt:
            new Date().toISOString(),

        site: {
            name:
                site.title,

            url:
                site.url
        },

        articles:
            articles.map(
                toMobileArticleSummary
            )
    };

    return new Response(
        JSON.stringify(response, null, 2),
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