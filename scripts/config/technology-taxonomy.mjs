/**
 * ==========================================================
 * Support Engineering Blog
 * Technology Taxonomy
 * ==========================================================
 *
 * Purpose:
 * Defines the canonical technology labels used by the
 * publication and the aliases that may appear in existing
 * article metadata.
 *
 * This file is the single source of truth for technology
 * taxonomy normalization.
 *
 * Policy:
 * - The first value in each group is the canonical label.
 * - Remaining values are recognized aliases.
 * - Article metadata should use the canonical label.
 *
 * This configuration does not modify article files by itself.
 * It is consumed by reporting and future taxonomy tooling.
 *
 * ==========================================================
 */

export const TECHNOLOGY_TAXONOMY = {

    "Microsoft Power Automate": [
        "Microsoft Power Automate",
        "Power Automate"
    ],

    "Microsoft Power Platform": [
        "Microsoft Power Platform",
        "Power Platform"
    ],

    "Microsoft Power BI": [
        "Microsoft Power BI",
        "Power BI"
    ],

    "Microsoft Azure": [
        "Microsoft Azure",
        "Azure"
    ]

};