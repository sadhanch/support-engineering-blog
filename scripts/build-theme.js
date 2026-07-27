const logger = require("./lib/logger");
const config = require("./lib/config");
const utils = require("./lib/utils");

function buildTheme(cssResult) {

    const css = cssResult.css;

    const template = utils.readFile(
        config.paths.themeTemplate
    );

    const theme = template.replace(
        "{{BLOGGER_CSS}}",
        css
    );

    utils.writeFile(
        config.paths.themeOutput,
        theme
    );

    logger.section("Theme Build");

    logger.info(
        "Template",
        config.paths.themeTemplate
    );

    logger.info(
        "Output",
        config.paths.themeOutput
    );

    logger.info(
        "CSS Size",
        `${css.length.toLocaleString()} characters`
    );

    return {

        output: config.paths.themeOutput,

        size: theme.length

    };

}

module.exports = buildTheme;