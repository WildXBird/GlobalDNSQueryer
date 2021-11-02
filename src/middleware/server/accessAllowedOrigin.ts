
import { IncomingMessage } from "http";
import { ACCESS_ALLOW_ORIGIN_LIST } from "../../config/config";
// let accessAllowOriginList = require("../config/config.js").accessAllowOriginList

type origin = IncomingMessage["headers"]["origin"]

/**  传入一个字符串，判断是否在 ACCESS_ALLOW_ORIGIN_LIST 里存在  */
export function IsAllowedOrigin(text: origin): boolean {
    text = String(text)
    return ACCESS_ALLOW_ORIGIN_LIST.includes(text)
    // for (let origin of ACCESS_ALLOW_ORIGIN_LIST) {
    //     if (origin === text) {
    //         return true
    //     }
    // }
    // return false
}