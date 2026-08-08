/**
 * ==========================================================
 * SEDS — Learning Path Data
 * Purpose: Static learning path cards currently displayed on the homepage.
 * ==========================================================
 */

export interface LearningPath {

    title: string;

    description: string;

    level: "Beginner" | "Intermediate" | "Advanced";

    articles: number;

    duration: string;

    href: string;

}

export const learningPaths: LearningPath[] = [

    {

        title: "Microsoft 365 Administration",

        description:
            "Learn identity, Exchange, SharePoint, Teams and Microsoft 365 administration.",

        level: "Beginner",

        articles: 18,

        duration: "8 Hours",

        href: "/learning-paths/microsoft-365"

    },

    {

        title: "Azure Fundamentals",

        description:
            "Build a solid understanding of Azure services, networking and identity.",

        level: "Beginner",

        articles: 15,

        duration: "6 Hours",

        href: "/learning-paths/azure"

    },

    {

        title: "Support Engineering",

        description:
            "Master troubleshooting methodologies, diagnostics and customer communication.",

        level: "Intermediate",

        articles: 22,

        duration: "10 Hours",

        href: "/learning-paths/support-engineering"

    }

];