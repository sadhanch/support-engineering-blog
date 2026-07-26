const fs = require("fs");
const path = require("path");
const packageJson = require("../package.json");

// --------------------------------------------------
// Configuration
// --------------------------------------------------

const config = {
    entry: path.join(
        __dirname,
        "..",
        "src",
        "assets",
        "css",
        "blogger",
        "blogger.css"
    ),

    output: path.join(
        __dirname,
        "..",
        "build",
        "blogger.css"
    )
};

// --------------------------------------------------
// Build Statistics
// --------------------------------------------------

const stats = {
    files: 0,
    start: Date.now()
};

// --------------------------------------------------
// Utility Functions
// --------------------------------------------------

function formatBytes(bytes) {
    if (bytes < 1024) return `${bytes} B`;

    return `${(bytes / 1024).toFixed(2)} KB`;
}

function buildBanner() {

    const today = new Date().toISOString();

    return `/*==========================================
 Support Engineering Blog
 Version : ${packageJson.version}
 Build   : ${today}
==========================================*/

`;

}

// --------------------------------------------------
// CSS Processing
// --------------------------------------------------

function processCSS(filePath) {

    stats.files++;

    const css = fs.readFileSync(filePath, "utf8");

    return css.replace(
        /@import\s+url\("(.+?)"\);/g,
        (_, importedFile) => {

            const importedPath = path.join(
                path.dirname(filePath),
                importedFile
            );

            if (!fs.existsSync(importedPath)) {

                throw new Error(
                    `Missing CSS file:\n${importedPath}`
                );

            }

            return processCSS(importedPath);

        }
    );

}

// --------------------------------------------------
// Write Output
// --------------------------------------------------

function writeOutput(css) {

    fs.mkdirSync(
        path.dirname(config.output),
        {
            recursive: true
        }
    );

    fs.writeFileSync(
        config.output,
        css
    );

}

// --------------------------------------------------
// Build
// --------------------------------------------------

function buildCSS() {

    const css =
        buildBanner() +
        processCSS(config.entry);

    writeOutput(css);

    const elapsed = Date.now() - stats.start;

    const size = fs.statSync(config.output).size;

    return {
        output: config.output,
        files: stats.files,
        size,
        elapsed
    };

}

module.exports = buildCSS;