"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserAccessCheck = void 0;
const randomWord = require("../../function/randomWord");
const { SessionMaker, SessionValidator } = require("./session");
const index_1 = require("../server/token/index");
async function UserAccessCheck(HTTPrequest) {
    let Authorization = HTTPrequest.headers.authorization || "";
    let AuthorizationBody = index_1.DecodeAuthorization(Authorization);
    if (AuthorizationBody) {
        return ({
            level: AuthorizationBody.level,
            uid: AuthorizationBody.uid,
        });
    }
    else {
        return ({
            level: "anonymous",
            uid: 0,
        });
    }
}
exports.UserAccessCheck = UserAccessCheck;
//# sourceMappingURL=index.js.map