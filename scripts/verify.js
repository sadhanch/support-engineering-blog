const fs = require("fs");

const config = require("./lib/config");
const utils = require("./lib/utils");
const logger = require("./lib/logger");

function verifyBuild() {

    logger.section("Output Verification");

    if (!fs.existsSync(config.paths.themeOutput)) {
        throw new Error(
            `Generated theme not found:\n${config.paths.themeOutput}`
        );
    }

    logger.info("Theme Output", "OK");

    const theme = utils.readFile(
        config.paths.themeOutput
    );

    if (theme.trim().length === 0) {
        throw new Error("Generated theme is empty.");
    }

    logger.info("Not Empty", "OK");

    if (theme.includes("{{BLOGGER_CSS}}")) {
        throw new Error(
            "Placeholder still exists in generated theme."
        );
    }

    logger.info("Placeholder Replaced", "OK");

    if (!theme.includes("<b:skin><![CDATA[")) {
        throw new Error(
            "Missing opening <b:skin> section."
        );
    }

    logger.info("Opening Skin Tag", "OK");

    if (!theme.includes("]]></b:skin>")) {
        throw new Error(
            "Missing closing </b:skin> section."
        );
    }

    logger.info("Closing Skin Tag", "OK");

}

module.exports = verifyBuild;