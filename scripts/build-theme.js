const logger = require("./lib/logger");
const config = require("./lib/config");
const utils = require("./lib/utils");
const assemble = require("./lib/assembler");
const loadTemplates = require("./lib/template-loader");

function buildTheme(cssResult) {

    // Phase 1: Read source files

    const css = cssResult.css;

    const template = utils.readFile(
        config.paths.themeTemplate
    );

    const templates = loadTemplates();

    // Phase 2: Assemble theme

    const replacements = {

        BLOGGER_CSS: css,

        ...templates

    };

    const theme = assemble(
        template,
        replacements
    );

    // Phase 3: Write output

    utils.writeFile(
        config.paths.themeOutput,
        theme
    );

    // Phase 4: Log build

    logger.section("Theme Build");

    logger.info(
        "Template",
        config.paths.themeTemplate
    );

    for (const name of Object.keys(templates)) {

        logger.info(
            name,
            "Loaded"
        );

    }

    logger.info(
        "Output",
        config.paths.themeOutput
    );

    logger.info(
        "CSS Size",
        `${css.length.toLocaleString()} characters`
    );

    // Phase 5: Return build information

    return {

        output: config.paths.themeOutput,

        size: theme.length

    };

}

module.exports = buildTheme;