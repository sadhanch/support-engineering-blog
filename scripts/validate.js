const fs = require("fs");

const config = require("./lib/config");
const utils = require("./lib/utils");
const logger = require("./lib/logger");

function validateBuild() {

    logger.section("Validation");

    if (!fs.existsSync(config.paths.cssEntry)) {
        throw new Error(
            `CSS entry file not found:\n${config.paths.cssEntry}`
        );
    }

    logger.info("CSS Entry", "OK");

    if (!fs.existsSync(config.paths.themeTemplate)) {
        throw new Error(
            `Theme template not found:\n${config.paths.themeTemplate}`
        );
    }

    logger.info("Theme Template", "OK");

    const template = utils.readFile(
        config.paths.themeTemplate
    );

    if (!template.includes("{{BLOGGER_CSS}}")) {
        throw new Error(
            "Missing placeholder: {{BLOGGER_CSS}}"
        );
    }

    logger.info("Placeholder", "OK");

}

module.exports = validateBuild;