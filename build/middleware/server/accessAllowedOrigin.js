"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IsAllowedOrigin = void 0;
const config_1 = require("../../config/config");
function IsAllowedOrigin(text) {
    text = String(text);
    return config_1.ACCESS_ALLOW_ORIGIN_LIST.includes(text);
}
exports.IsAllowedOrigin = IsAllowedOrigin;
//# sourceMappingURL=accessAllowedOrigin.js.map