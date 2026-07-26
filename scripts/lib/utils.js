const fs = require("fs");
const path = require("path");

function ensureDirectory(filePath) {

    fs.mkdirSync(
        path.dirname(filePath),
        {
            recursive: true
        }
    );

}

function readFile(filePath) {

    return fs.readFileSync(
        filePath,
        "utf8"
    );

}

function writeFile(filePath, content) {

    ensureDirectory(filePath);

    fs.writeFileSync(
        filePath,
        content
    );

}

function formatBytes(bytes) {

    if (bytes < 1024) {
        return `${bytes} B`;
    }

    return `${(bytes / 1024).toFixed(2)} KB`;

}

function normalizePath(filePath) {

    return filePath.replace(/\\/g, "/");

}

module.exports = {
    ensureDirectory,
    readFile,
    writeFile,
    formatBytes,
    normalizePath
};