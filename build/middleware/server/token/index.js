"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddDeprecatedToken = exports.AuthorizationText2B64 = exports.TokenText2MD5 = exports.DecodeAuthorization = exports.CreateAuthorization = void 0;
const crypto = require("crypto");
const index_1 = require("../../../config/token/index");
let RSAencrypt = function (privateKey, buffer) {
    return crypto.privateEncrypt({ key: privateKey, passphrase: '' }, buffer);
};
let RSAdecrypt = function (publicKey, encryptData) {
    return crypto.publicDecrypt({ key: publicKey, }, encryptData);
};
let AESencrypt = function (key, iv, buffer) {
    const cipher = crypto.createCipheriv('aes-128-cbc', key, iv);
    return cipher.update(buffer, undefined, "base64") + cipher.final("base64");
};
let AESdecrypt = function (key, iv, encryptData) {
    const decipher = crypto.createDecipheriv('aes-128-cbc', key, iv);
    return decipher.update(encryptData, "base64", "utf8") + decipher.final('utf8');
};
function isTokenExpired(AuthorizationTokenText) {
    const AuthorizationTokenMD5 = TokenText2MD5(AuthorizationTokenText);
    if (typeof (deprecatedTokenList[AuthorizationTokenMD5]) !== "undefined") {
        return true;
    }
    return false;
}
function CreateAuthorization(data) {
    const AES_KEY = crypto.randomBytes(16);
    const AES_IV = crypto.randomBytes(16);
    const RSA_PRIVATE_KEY = index_1.TOKEN_PRIVATE_KEY;
    const encryptedAESKey = RSAencrypt(RSA_PRIVATE_KEY, AES_KEY);
    let expireTime;
    if (data.expireTime instanceof Date) {
        expireTime = data.expireTime.toISOString();
    }
    else {
        expireTime = new Date(new Date().valueOf() + (index_1.TOKEN_EXPIRE_DAYS * 3600 * 24 * 1000)).toISOString();
    }
    const AuthorizationBody = {
        uid: data.uid,
        ua: data.ua,
        ip: data.ip,
        level: data.level,
        createTime: new Date().toISOString(),
        expireTime,
    };
    const AuthorizationBodyBuffer = Buffer.from(JSON.stringify(AuthorizationBody));
    const encryptedAuthorizationBase64Body = AESencrypt(AES_KEY, AES_IV, AuthorizationBodyBuffer);
    const AuthorizationTokenObj = {
        ver: 1,
        env: "Prod",
        typ: "bdt",
        enc: "A128CBC",
        int: "RS256",
        iv: AES_IV.toString("base64"),
        key: encryptedAESKey.toString("base64"),
        body: encryptedAuthorizationBase64Body
    };
    const AuthorizationToken = Buffer.from(JSON.stringify(AuthorizationTokenObj)).toString('base64');
    let rememberToken = undefined;
    if (data.remember) {
        const RemberTokenBody = {
            rmToken: true,
            ...AuthorizationBody
        };
        const RemberTokenBodyBuffer = Buffer.from(JSON.stringify(RemberTokenBody));
        const encryptedRemberTokenBase64Body = AESencrypt(AES_KEY, AES_IV, RemberTokenBodyBuffer);
        const RemberTokenObj = {
            ver: 1,
            env: "Prod",
            typ: "bdt",
            enc: "A128CBC",
            int: "RS256",
            iv: AES_IV.toString("base64"),
            key: encryptedAESKey.toString("base64"),
            body: encryptedRemberTokenBase64Body
        };
        const RemberToken = Buffer.from(JSON.stringify(RemberTokenObj)).toString('base64');
        rememberToken = RemberToken;
    }
    return {
        authorizationToken: AuthorizationToken,
        rememberToken,
    };
}
exports.CreateAuthorization = CreateAuthorization;
function DecodeAuthorization(data) {
    try {
        if (data.length < 50) {
            throw "TokenTooShortOrEmpty";
        }
        if (isTokenExpired(data)) {
            throw "TokenExpired";
        }
        const RSA_PUBLIC_KEY = index_1.TOKEN_PUBLIC_KEY;
        const AuthorizationTokenText = Buffer.from(data, "base64").toString("utf8");
        const AuthorizationTokenObj = JSON.parse(AuthorizationTokenText);
        const AES_IV = Buffer.from(AuthorizationTokenObj.iv, "base64");
        const encryptedAESKey = Buffer.from(AuthorizationTokenObj.key, "base64");
        const encryptedAuthorizationBase64Body = AuthorizationTokenObj.body;
        if ("A128CBC" === AuthorizationTokenObj.enc && "RS256" === AuthorizationTokenObj.int) {
            const AES_KEY = RSAdecrypt(RSA_PUBLIC_KEY, encryptedAESKey);
            const AuthorizationBodyText = AESdecrypt(AES_KEY, AES_IV, encryptedAuthorizationBase64Body);
            const AuthorizationBody = JSON.parse(AuthorizationBodyText);
            if (AuthorizationBody) {
                const TokenExpireTimeValue = new Date(AuthorizationBody.expireTime).valueOf();
                if (new Date().valueOf() < TokenExpireTimeValue) {
                    return AuthorizationBody;
                }
            }
        }
        throw "TypeError";
    }
    catch (error) {
        return undefined;
    }
}
exports.DecodeAuthorization = DecodeAuthorization;
function TokenText2MD5(token) {
    var hash = crypto.createHash('md5');
    hash.update(token);
    return hash.digest('hex');
}
exports.TokenText2MD5 = TokenText2MD5;
function AuthorizationText2B64(token) {
    if (token.startsWith("Bdc_v1 t=") || token.startsWith("rm_v1 t=")) {
        const B64 = token.replace("Bdc_v1 t=", "").replace("rm_v1 t=", "");
        return B64;
    }
}
exports.AuthorizationText2B64 = AuthorizationText2B64;
const deprecatedTokenList = {};
async function AddDeprecatedToken(authorizationText) {
    try {
        const authorizationB64Text = AuthorizationText2B64(authorizationText);
        if (authorizationB64Text) {
            const decodeResult = DecodeAuthorization(authorizationB64Text);
            if (decodeResult) {
                const expireTimeText = decodeResult.expireTime;
                let expireTime = new Date(new Date().valueOf() + 1000 * 3600 * 24 * 30);
                try {
                    expireTime = new Date(expireTimeText);
                }
                catch (error) {
                }
                const md5 = TokenText2MD5(authorizationB64Text);
                deprecatedTokenList[md5] = expireTime;
                return (true);
            }
        }
        else {
            return (false);
        }
    }
    catch (error) {
        console.error(error);
    }
    return (false);
}
exports.AddDeprecatedToken = AddDeprecatedToken;
//# sourceMappingURL=index.js.map