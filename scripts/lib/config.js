const path = require("path");
const packageJson = require("../../package.json");

const ROOT = path.resolve(__dirname, "..", "..");

module.exports = {

    // =====================================================
    // Project Information
    // =====================================================

    project: {
        name: "Support Engineering Blog",
        version: packageJson.version
    },

    // =====================================================
    // Template Placeholder Mapping
    // =====================================================

    templates: {

        METADATA: "metadataTemplate",

        VARIABLES: "variablesTemplate",

        LAYOUT: "layoutTemplate",

        WIDGETS: "widgetsTemplate",

        INCLUDES: "includesTemplate",

        HEADER: "headerTemplate",

        NAVIGATION: "navigationTemplate"

    },

    // =====================================================
    // Build Paths
    // =====================================================

    paths: {

        root: ROOT,

        // ---------------------------------------------
        // CSS
        // ---------------------------------------------

        cssEntry: path.join(
            ROOT,
            "src",
            "assets",
            "css",
            "blogger",
            "blogger.css"
        ),

        cssOutput: path.join(
            ROOT,
            "build",
            "blogger.css"
        ),

        // ---------------------------------------------
        // Theme
        // ---------------------------------------------

        themeTemplate: path.join(
            ROOT,
            "src",
            "templates",
            "theme.xml"
        ),

        themeOutput: path.join(
            ROOT,
            "build",
            "theme.xml"
        ),

        // ---------------------------------------------
        // Theme Components
        // ---------------------------------------------

        metadataTemplate: path.join(
            ROOT,
            "src",
            "templates",
            "components",
            "metadata",
            "metadata.xml"
        ),

        variablesTemplate: path.join(
            ROOT,
            "src",
            "templates",
            "components",
            "variables",
            "variables.xml"
        ),

        layoutTemplate: path.join(
            ROOT,
            "src",
            "templates",
            "layout.xml"
        ),

        widgetsTemplate: path.join(
            ROOT,
            "src",
            "templates",
            "components",
            "widgets",
            "widgets.xml"
        ),

        includesTemplate: path.join(
            ROOT,
            "src",
            "templates",
            "components",
            "includes",
            "includes.xml"
        ),

        headerTemplate: path.join(
            ROOT,
            "src",
            "templates",
            "components",
            "includes",
            "header.xml"
        ),

        navigationTemplate: path.join(
            ROOT,
            "src",
            "templates",
            "components",
            "includes",
            "navigation.xml"
        ),

    }

};