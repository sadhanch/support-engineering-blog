export interface Category {

    title: string;

    description: string;

    href: string;

    articleCount: number;

}

export const categories: Category[] = [

    {

        title: "Microsoft 365",

        description: "Administration, Exchange, SharePoint, Teams and Entra ID.",

        href: "/categories/microsoft-365",

        articleCount: 24

    },

    {

        title: "Azure",

        description: "Identity, virtual machines, networking and cloud services.",

        href: "/categories/azure",

        articleCount: 18

    },

    {

        title: "Power Platform",

        description: "Power Apps, Power Automate and Dataverse.",

        href: "/categories/power-platform",

        articleCount: 15

    },

    {

        title: "Windows",

        description: "Windows administration and endpoint management.",

        href: "/categories/windows",

        articleCount: 21

    }

];