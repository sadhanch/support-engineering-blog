function line() {

    console.log("======================================");

}

function header(title) {

    console.log("");
    line();
    console.log(` ${title}`);
    line();
    console.log("");

}

function section(title) {

    console.log(title);
    console.log("--------------------------------------");

}

function info(label, value) {

    console.log(`${label.padEnd(16)} : ${value}`);

}

function success(message) {

    console.log("");
    console.log(`✅ ${message}`);
    console.log("");

}

function error(message) {

    console.log("");
    console.error(`❌ ${message}`);
    console.log("");

}

module.exports = {
    header,
    section,
    info,
    success,
    error
};