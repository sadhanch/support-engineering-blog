const fs = require("fs");
const path = require("path");

const config = require("./lib/config");
const utils = require("./lib/utils");
const buildBanner = require("./lib/banner");

function processCSS(filePath, stats) {

    stats.files++;

    const css = utils.readFile(filePath);

    return css.replace(
        /@import\s+url\("(.+?)"\);/g,
        (_, importFile) => {

            const importPath = path.join(
                path.dirname(filePath),
                importFile
            );

            if (!fs.existsSync(importPath)) {
                throw new Error(
                    `Missing CSS file:\n${importPath}`
                );
            }

            return processCSS(importPath, stats);

        }
    );

}

function buildCSS() {

    const stats = {
        files: 0,
        start: Date.now()
    };

    const css =
        buildBanner() +
        processCSS(config.paths.cssEntry, stats);

    utils.writeFile(
        config.paths.cssOutput,
        css
    );

    return {
    css,
    output: config.paths.cssOutput,
    files: stats.files,
    size: fs.statSync(config.paths.cssOutput).size,
    elapsed: Date.now() - stats.start
};

}

module.exports = buildCSS;