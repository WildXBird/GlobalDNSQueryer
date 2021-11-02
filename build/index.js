"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const HookRequirePath = require('hook-require-path');
const hookRequirePath = new HookRequirePath();
hookRequirePath.addRule('~', './*');
hookRequirePath.addRule('@', './');
hookRequirePath.addRule('app', './app');
hookRequirePath.addRule('config', './config');
hookRequirePath.addRule('types', './fookingTypes');
hookRequirePath.addRule('function', './function');
hookRequirePath.addRule('middleware', './middleware');
hookRequirePath.addRule('tools', './tools');
hookRequirePath.addRule('vmCore', './vmCore');
hookRequirePath.install();
const serverStart_1 = require("./middleware/serverStart");
(async () => {
    serverStart_1.serverStart();
})();
process.on('uncaughtException', function (err) {
    console.error("uncaughtException", err);
    process.exit(2);
});
process.on('unhandledRejection', function (err) {
    console.error("!!!unhandledRejection", err);
    process.exit(2);
});
//# sourceMappingURL=index.js.map