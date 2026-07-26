const config = require("./config");

function buildBanner() {

    return `/*==========================================
 ${config.project.name}
 Version : ${config.project.version}
 Build   : ${new Date().toISOString()}
==========================================*/

`;

}

module.exports = buildBanner;