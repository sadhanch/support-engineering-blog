const fs = require("fs");

const config = require("./lib/config");
const utils = require("./lib/utils");
const logger = require("./lib/logger");

function validateBuild() {

    logger.section("Validation");

    validateProject();

    validateXML();

}

function validateProject() {

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

function validateXML() {

    for (const pathKey of config.validationFiles) {

        const filePath = config.paths[pathKey];

        if (!fs.existsSync(filePath)) {
            continue;
        }

        const xml = utils.readFile(filePath);

        validateComments(filePath, xml);

    }

    logger.info("XML Comments", "OK");

}

function validateComments(filePath, xml) {

    const comments = xml.match(/<!--[\s\S]*?-->/g);

    if (!comments) {
        return;
    }

    for (const comment of comments) {

        const body = comment
            .replace("<!--", "")
            .replace("-->", "");

        if (body.includes("--")) {

            throw new Error(
`Illegal XML comment detected.

File:
${filePath}

XML comments cannot contain "--".

Replace decorative dashed separators with "=" or plain text.`
            );

        }

    }

}

module.exports = validateBuild;