const fs = require("fs");
const path = require("path");

const config = require("./config");
const utils = require("./utils");

function loadDirectory(directory) {

    if (!fs.existsSync(directory)) {

        throw new Error(
            `Directory not found: ${directory}`
        );

    }

    return fs
        .readdirSync(directory)
        .filter(file =>

            file.endsWith(".xml") &&
            !file.startsWith(".")

        )
        .sort()
        .map(file =>

            utils.readFile(
                path.join(directory, file)
            )

        )
        .join("\n\n");

}

function loadTemplates() {

    return {

        template: utils.readFile(
            config.paths.themeTemplate
        ),

        metadata: utils.readFile(
            config.paths.metadataTemplate
        ),

        variables: utils.readFile(
            config.paths.variablesTemplate
        ),

        layout: utils.readFile(
            config.paths.layoutTemplate
        ),

        widgets: loadDirectory(
            config.paths.widgetsDirectory
        )

    };

}

module.exports = loadTemplates;