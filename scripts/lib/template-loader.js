const config = require("./config");
const utils = require("./utils");

function loadTemplates() {

    const templates = {};

    for (const [placeholder, pathKey] of Object.entries(config.templates)) {

        templates[placeholder] = utils.readFile(
            config.paths[pathKey]
        );

    }

    return templates;

}

module.exports = loadTemplates;