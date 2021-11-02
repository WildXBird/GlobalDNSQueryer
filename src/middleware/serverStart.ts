import { Server } from "http";
import * as http from "http";
import * as Chokidar from "chokidar";
import * as CONFIG from "../config/config";
import { takeServer } from "./takeServer";


// import { GLOBAL, } from "../fookingTypes/global"
// import { setInterval } from "timers";

export function serverStart() {


    const server: Server = http.createServer()
    server.listen(CONFIG.SERVER_LISTENING_PORT, () => {
        console.log(`Server start at :${CONFIG.SERVER_LISTENING_PORT}`);
    });
    takeServer(server)
    {
        let cwd = process.cwd()
        console.log("检测文件中:", cwd)
        Chokidar.watch(process.cwd()).on('change', (path, event) => {
            let rPath = path.replace(cwd, "")
            if (!rPath.startsWith("\\build")) {
                console.log("检测到文件变动：", rPath)
                console.log("正在重启", rPath)
                require('taskkill')([process.pid], { force: true })
            }
        });
    }

    // setInterval(() => {
    //     console.log("setInterval")
    // }, 1000);
}
