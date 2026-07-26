const buildCSS = require("./build-css");
const buildTheme = require("./build-theme");

function runBuild() {

    console.log("");
    console.log("======================================");
    console.log(" Support Engineering Blog Builder");
    console.log("======================================");
    console.log("");

    try {

        const cssResult = buildCSS();

        console.log("CSS Build");
        console.log("--------------------------------------");
        console.log(`Files Processed : ${cssResult.files}`);
        console.log(`Output Size     : ${(cssResult.size / 1024).toFixed(2)} KB`);
        console.log(`Build Time      : ${cssResult.elapsed} ms`);
        console.log("");

        console.log("✅ Build completed successfully.");
        console.log("");

    } catch (error) {

        console.error("");
        console.error("❌ Build Failed");
        console.error("");
        console.error(error.message);
        console.error("");

        process.exit(1);

    }

}

runBuild();