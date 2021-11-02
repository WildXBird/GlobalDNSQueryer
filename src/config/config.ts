import { type } from "os"

const ENV: environment = "prod"

let mysqlMain = {
    host: "1.117.224.162",
    user: "JSVMachine",
    password: "ezyZJR8NPZx47cBy",
    database: 'jsvmachine'
}
// export mysqlMain
// let accessAllowOriginList = [
let ACCESS_ALLOW_ORIGIN_LIST = [
    // "http://az.yubis.net",
    // "http://approve.yubis.net",
    // "https://approve.yubis.net",
    // "https://azhealthclub.com.hk",
    // "https://az.yubis.net",
    // "http://localhost:3000",
    // "http://127.0.0.1:8000",
    "http://console.brokendreams.cloud",
    "https://console.brokendreams.cloud",
]
// export accessAllowOriginList
let SERVER_LISTENING_PORT = 18051
export {
    ENV,
    mysqlMain,
    ACCESS_ALLOW_ORIGIN_LIST,
    SERVER_LISTENING_PORT,
}

type environment = "prod" | "dev"