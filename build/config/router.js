"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BUILTIN_PROCESSOR = exports.ROUTER_TABLE = void 0;
console.log("pee", process.cwd());
const P404 = require("app/builtIn/404");
const DNS = require("app/dns");
const LOGGED = ["blocked", "freeUser", "paidUser", "admin", "master"];
const UNBLOCKED_LOGGED_USER = ["freeUser", "paidUser", "admin", "master"];
const ROUTER_TABLE = [
    {
        "path": "./resolve",
        "processor": DNS.handle,
    },
];
exports.ROUTER_TABLE = ROUTER_TABLE;
const BUILTIN_PROCESSOR = {
    "404": {
        "processor": P404.handle,
    }
};
exports.BUILTIN_PROCESSOR = BUILTIN_PROCESSOR;
//# sourceMappingURL=router.js.map