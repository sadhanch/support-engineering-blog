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
        content,
        "utf8"
    );

}

function fileExists(filePath) {

    return fs.existsSync(filePath);

}

function formatBytes(bytes) {

    if (bytes < 1024) {

        return `${bytes} B`;

    }

    if (bytes < 1024 * 1024) {

        return `${(bytes / 1024).toFixed(2)} KB`;

    }

    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;

}

function normalizePath(filePath) {

    return path.normalize(filePath);

}

module.exports = {

    ensureDirectory,

    readFile,

    writeFile,

    fileExists,

    formatBytes,

    normalizePath

};