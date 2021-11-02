import { Server as _httpServer, IncomingMessage, ServerResponse } from "http";

const randomWord = require("../../function/randomWord")
const { SessionMaker, SessionValidator } = require("./session")
import { userAccessLevel, UserAccessCheckResult } from "../../fookingTypes/users";
import { Server, HttpRequest } from "../../fookingTypes/server"
import { DecodeAuthorization } from "../server/token/index"

/** 确定请求人的身份信息，包括用户等级、用户名、用户ID、各项类别余额等 */
export async function UserAccessCheck(HTTPrequest: IncomingMessage): Promise<UserAccessCheckResult> {
    // return new Promise<UserAccessCheckResult>(function (resolve, reject) {
    let Authorization = HTTPrequest.headers.authorization || ""
    let AuthorizationBody = DecodeAuthorization(Authorization)
    if (AuthorizationBody) {
        return ({
            level: AuthorizationBody.level,
            uid: AuthorizationBody.uid,
        });
    } else {
        return ({
            level: "anonymous",
            uid: 0,
        });
    }
    // let level: userAccessLevel = "anonymous"
    // if (AuthorizationBody.uid === 0) {
    //     level = "anonymous"
    // } else if (AuthorizationBody.uid > 0) {
    //     level = AuthorizationBody.level
    // }

    // resolve({
    //     level,
    //     uid: AuthorizationBody.uid,
    // });
    // });



    // let sessionInfo = {
    //     userId: 34341,
    //     deviceInfo: {
    //         ua: "",
    //         localStorageDID: "22123-23232"
    //     },
    //     risk: {
    //         // https://docs.multilogin.com/l/zh/category/o40iDKTlyQ-
    //         level: 0.4,
    //         reason: [
    //             {
    //                 name: "timeZone",
    //                 data: {}
    //             },
    //         ]
    //     }
    // }

    // let sessionText = SessionMaker(sessionInfo)
    // console.log("UserAccessCheck.sessionText", sessionText)
    // console.log("UserAccessCheck.SessionValidator", SessionValidator(sessionText))





    // if (!Array.isArray(global.loginKeys)) {
    //     global.loginKeys = ["ORHmSGzcppHBxVQsHRpYD3xLEYL5W2yV6OdELjWIPr49fGJXkpKCjMF7ICNB"]
    // }
    // if (typeof (headers) != "object") {
    //     headers = {}
    // }



    // return "anonymous"
    // let accesskey = headers.accesskey
    // if (typeof (headers.accesskey) === "string") {


    //     if (validAccessToken(accesskey)) {
    //         return { userType: "user", userId: 0 }
    //     }
    // }
    // return { userType: "anonymous", userId: 0 }
}
