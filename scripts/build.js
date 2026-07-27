const buildCSS = require("./build-css");
const buildTheme = require("./build-theme");

const logger = require("./lib/logger");
const utils = require("./lib/utils");

function runBuild() {

    logger.header("Support Engineering Blog Builder");

    try {

    const cssResult = buildCSS();

    logger.section("CSS Build");
    logger.info("Files", cssResult.files);
    logger.info("Output", cssResult.output);
    logger.info("Size", utils.formatBytes(cssResult.size));
    logger.info("Time", `${cssResult.elapsed} ms`);

    buildTheme(cssResult.css);

    logger.success("Build completed successfully.");

    } catch (error) {

    logger.error(error.message);
    process.exit(1);

    }

}

runBuild();