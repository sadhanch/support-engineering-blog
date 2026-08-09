/**
 * ==========================================================
 * SEDS — Category Configuration
 * Purpose: Defines the editorial information and homepage
 * visibility for supported article categories.
 * ==========================================================
 */

export interface Category {

    title: string;

    description: string;

    slug: string;

    featured: boolean;

    order: number;

}


/* ==========================================================
   Category Definitions
   ----------------------------------------------------------
   This file controls the categories that are intentionally
   represented on the site.

   Article counts are NOT stored here.
   They are calculated from the published article collection.
   ========================================================== */

export const categories: Category[] = [

    {

        title: "Microsoft 365",

        description:
            "Administration, Exchange, SharePoint, Teams and Entra ID.",

        slug: "microsoft-365",

        featured: true,

        order: 1

    },

    {

        title: "Azure",

        description:
            "Identity, virtual machines, networking and cloud services.",

        slug: "azure",

        featured: true,

        order: 2

    },

    {

        title: "Power Platform",

        description:
            "Power Apps, Power Automate and Dataverse.",

        slug: "power-platform",

        featured: true,

        order: 3

    },

    {

        title: "Windows",

        description:
            "Windows administration and endpoint management.",

        slug: "windows",

        featured: true,

        order: 4

    }

];