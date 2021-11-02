"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TOKEN_EXPIRE_DAYS = exports.TOKEN_PUBLIC_KEY = exports.TOKEN_PRIVATE_KEY = void 0;
const fs = require('fs');
const path = require('path');
const TOKEN_PRIVATE_KEY = fs.readFileSync(path.join(__dirname, "./private_Key"), 'utf-8');
exports.TOKEN_PRIVATE_KEY = TOKEN_PRIVATE_KEY;
const TOKEN_PUBLIC_KEY = fs.readFileSync(path.join(__dirname, "./public_key"), 'utf-8');
exports.TOKEN_PUBLIC_KEY = TOKEN_PUBLIC_KEY;
const TOKEN_EXPIRE_DAYS = 14;
exports.TOKEN_EXPIRE_DAYS = TOKEN_EXPIRE_DAYS;
//# sourceMappingURL=index.js.map