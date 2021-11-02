const HookRequirePath = require('hook-require-path')
const hookRequirePath = new HookRequirePath()
hookRequirePath.addRule('~', './*')
hookRequirePath.addRule('@', './')//./build
hookRequirePath.addRule('app', './app')
hookRequirePath.addRule('@config', '../config')
hookRequirePath.addRule('config', './config')
hookRequirePath.addRule('types', './fookingTypes')
hookRequirePath.addRule('function', './function')
hookRequirePath.addRule('middleware', './middleware')
hookRequirePath.addRule('tools', './tools')
hookRequirePath.addRule('vmCore', './vmCore')
hookRequirePath.install()

// //入口


import { serverStart } from "./middleware/serverStart"
(async () => {
    serverStart()

    // setInterval(() => { console.log("con", process.cwd()) }, 1000);
})();


/////////////////////////////////////////////////////////////
process.on('uncaughtException', function (err) {
    console.error("uncaughtException", err);
    process.exit(2)
});
process.on('unhandledRejection', function (err) {
    console.error("!!!unhandledRejection", err);
    process.exit(2)
});
