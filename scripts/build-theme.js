const logger = require("./lib/logger");
const config = require("./lib/config");
const utils = require("./lib/utils");
const assemble = require("./lib/assembler");

function buildTheme(cssResult) {

    // Phase 1: Read source files

    const css = cssResult.css;

    const template = utils.readFile(
        config.paths.themeTemplate
    );
    
    const metadata = utils.readFile(
        config.paths.metadataTemplate
    );

    const layout = utils.readFile(
        config.paths.layoutTemplate
    );

    const widgets = utils.readFile(
        config.paths.widgetsTemplate
    );

    const includes = utils.readFile(
        config.paths.includesTemplate
    );

    // Phase 2: Assemble theme

    const replacements = {

        BLOGGER_CSS: css,

        METADATA: metadata,

        LAYOUT: layout,

        WIDGETS: widgets,

        INCLUDES: includes

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

    logger.info(
        "Metadata",
        config.paths.metadataTemplate
    );

    logger.info(
        "Layout",
        config.paths.layoutTemplate
    );

    logger.info(
        "Widgets",
        config.paths.widgetsTemplate
    );

    logger.info(
        "Includes",
        config.paths.includesTemplate
    );

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