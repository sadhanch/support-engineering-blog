/**
 * ==========================================================
 * SEDS — Learning Path Data
 * Purpose: Defines curated learning paths and the ordered
 * articles that belong to each path.
 * ==========================================================
 */

export interface LearningPath {

    slug: string;

    title: string;

    description: string;

    level: "Beginner" | "Intermediate" | "Advanced";

    steps: string[];

}


/* ==========================================================
   Learning Path Definitions
   ----------------------------------------------------------
   The order of the article IDs in `steps` determines the
   learning sequence.

   Learning Paths are editorially curated. They are not
   automatically generated from categories, technologies,
   or tags.
   ========================================================== */

export const learningPaths: LearningPath[] = [

    {

        slug: "microsoft-365",

        title: "Microsoft 365 Administration",

        description:
            "Learn identity, Exchange, SharePoint, Teams and Microsoft 365 administration.",

        level: "Beginner",

        steps: []

    },

    {

        slug: "azure",

        title: "Azure Fundamentals",

        description:
            "Build a solid understanding of Azure services, networking and identity.",

        level: "Beginner",

        steps: []

    },

    {

        slug: "support-engineering",

        title: "Support Engineering",

        description:
            "Master troubleshooting methodologies, diagnostics and customer communication.",

        level: "Intermediate",

        steps: []

    }

];