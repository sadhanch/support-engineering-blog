const path = require("path");
const packageJson = require("../../package.json");

const ROOT = path.resolve(__dirname, "..", "..");

module.exports = {

    project: {
        name: "Support Engineering Blog",
        version: packageJson.version
    },

    paths: {

        root: ROOT,

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
        )

    }

};