export interface Article {

    href: string;

    category: string;

    title: string;

    description: string;

    readingTime: string;

    updated: string;

}

export const latestArticles: Article[] = [

    {

        href: "/articles/project-online-retirement",

        category: "Microsoft 365",

        title: "Project Online is Retiring: What Microsoft 365 Admins Need to Know",

        description:
            "Understand Microsoft's retirement timeline, migration strategy, and what it means for enterprise organizations.",

        readingTime: "10 min",

        updated: "July 2026"

    },

    {

        href: "/articles/planner-premium",

        category: "Planner",

        title: "Planner Premium vs Microsoft Project: Which One Should You Choose?",

        description:
            "Compare capabilities, licensing, and use cases to determine which solution fits your organization.",

        readingTime: "8 min",

        updated: "July 2026"

    },

    {

        href: "/articles/copilot",

        category: "Copilot",

        title: "How Microsoft 365 Copilot is Changing IT Administration",

        description:
            "Explore practical scenarios where Copilot improves productivity for Microsoft 365 administrators.",

        readingTime: "12 min",

        updated: "July 2026"

    }

];