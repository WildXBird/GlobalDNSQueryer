"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SERVER_LISTENING_PORT = exports.ACCESS_ALLOW_ORIGIN_LIST = exports.mysqlMain = exports.ENV = void 0;
const ENV = "prod";
exports.ENV = ENV;
let mysqlMain = {
    host: "1.117.224.162",
    user: "JSVMachine",
    password: "ezyZJR8NPZx47cBy",
    database: 'jsvmachine'
};
exports.mysqlMain = mysqlMain;
let ACCESS_ALLOW_ORIGIN_LIST = [
    "http://console.brokendreams.cloud",
    "https://console.brokendreams.cloud",
];
exports.ACCESS_ALLOW_ORIGIN_LIST = ACCESS_ALLOW_ORIGIN_LIST;
let SERVER_LISTENING_PORT = 18051;
exports.SERVER_LISTENING_PORT = SERVER_LISTENING_PORT;
//# sourceMappingURL=config.js.map