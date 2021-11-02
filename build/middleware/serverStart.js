"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.serverStart = void 0;
const http = require("http");
const Chokidar = require("chokidar");
const CONFIG = require("../config/config");
const takeServer_1 = require("./takeServer");
function serverStart() {
    const server = http.createServer();
    server.listen(CONFIG.SERVER_LISTENING_PORT, () => {
        console.log(`Server start at :${CONFIG.SERVER_LISTENING_PORT}`);
    });
    takeServer_1.takeServer(server);
    {
        let cwd = process.cwd();
        console.log("检测文件中:", cwd);
        Chokidar.watch(process.cwd()).on('change', (path, event) => {
            let rPath = path.replace(cwd, "");
            if (!rPath.startsWith("\\build")) {
                console.log("检测到文件变动：", rPath);
                console.log("正在重启", rPath);
                require('taskkill')([process.pid], { force: true });
            }
        });
    }
}
exports.serverStart = serverStart;
//# sourceMappingURL=serverStart.js.map