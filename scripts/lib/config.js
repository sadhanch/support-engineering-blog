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
    // XML Validation Files
    // =====================================================

    validationFiles: [

        "themeTemplate",

        "metadataTemplate",

        "variablesTemplate",

        "layoutTemplate"

    ],

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
            "theme",
            "theme.xml"
        ),

        themeOutput: path.join(
            ROOT,
            "build",
            "theme.xml"
        ),

        // ---------------------------------------------
        // Template Files
        // ---------------------------------------------

        metadataTemplate: path.join(
            ROOT,
            "src",
            "templates",
            "metadata",
            "metadata.xml"
        ),

        variablesTemplate: path.join(
            ROOT,
            "src",
            "templates",
            "variables",
            "variables.xml"
        ),

        layoutTemplate: path.join(
            ROOT,
            "src",
            "templates",
            "layout",
            "layout.xml"
        ),

        // ---------------------------------------------
        // Widget Directory
        // ---------------------------------------------

        widgetsDirectory: path.join(
            ROOT,
            "src",
            "templates",
            "widgets"
        )

    }

};