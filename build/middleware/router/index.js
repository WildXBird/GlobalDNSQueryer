"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RouterFinder = void 0;
const router_1 = require("../../config/router");
function RouterFinder(path) {
    let currentRouters = router_1.ROUTER_TABLE;
    const P404 = router_1.BUILTIN_PROCESSOR["404"];
    let target = P404;
    let inheritedAccess = [];
    let restPathnameArray = [];
    let searchDepth = 0;
    for (let id in path) {
        const pointer = path[id];
        for (let pathRaw of currentRouters) {
            if (pathRaw.path.startsWith("./")) {
                let pathText = pathRaw.path.replace("./", "").toLocaleLowerCase();
                if (pathText.indexOf("/") === -1) {
                    let lowerCasePointer = pointer.toLocaleLowerCase();
                    if (pathText == lowerCasePointer) {
                        searchDepth++;
                        restPathnameArray = [...path].splice(Number(id) + 1);
                        target = pathRaw;
                        currentRouters = pathRaw.routes || [];
                        inheritedAccess.push(pathRaw.access);
                        break;
                    }
                }
            }
        }
    }
    const Result404 = {
        inheritedAccess: [],
        processor: {
            handle: P404.processor,
            name: P404.processor.name || "untitled404Context",
            timeout: 5,
            acceptBody: P404.acceptBody,
            access: P404.access || []
        },
        restPathnameArray: path
    };
    if (target.exact) {
        if (path.length !== searchDepth) {
            console.log("RouterFinder", "exact-miss", path);
            return Result404;
        }
    }
    if (target.processor) {
        return {
            inheritedAccess,
            processor: {
                handle: target.processor,
                name: target.processor.name || "untitledProcessor",
                timeout: 120,
                acceptBody: target.acceptBody,
                access: target.access || ["blocked"]
            },
            restPathnameArray
        };
    }
    console.log("RouterFinder", "404-path", path);
    return Result404;
}
exports.RouterFinder = RouterFinder;
//# sourceMappingURL=index.js.map