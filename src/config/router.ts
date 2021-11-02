import { RouterTable, BuiltInProcessors } from "../fookingTypes/server";
import { APIProcessor_Prototype } from "middleware/server/processor"

//////processor在这里引入//////////
console.log("pee", process.cwd())
import * as P404 from "app/builtIn/404"
import * as DNS from "app/dns"

const LOGGED = ["blocked", "freeUser", "paidUser", "admin", "master"]
const UNBLOCKED_LOGGED_USER = ["freeUser", "paidUser", "admin", "master"]
/** 全局处理器路由表 */
const ROUTER_TABLE: RouterTable = [
    {
        "path": "./resolve",
        "processor": DNS.handle,
    },
]
/** 内置处理器路由表 */
const BUILTIN_PROCESSOR: BuiltInProcessors = {
    "404": {
        "processor": P404.handle,
    }
}


export { ROUTER_TABLE, BUILTIN_PROCESSOR }