"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.takeServer = void 0;
const userAccessCheck_1 = require("./userAccessCheck");
const router_1 = require("./router");
const transactionId_1 = require("./server/transactionId");
const accessAllowedOrigin_1 = require("./server/accessAllowedOrigin");
const makeResponse_1 = require("./server/makeResponse");
const RemoteFamilyTransform = function (input) {
    if (input.indexOf("4") != -1) {
        return "IPv4";
    }
    else if (input.indexOf("6") != -1) {
        return "IPv6";
    }
    else {
        return "IPv6";
    }
};
const refuseRequest = function (transactionId, httpResponse, moreInfo) {
    let response = makeResponse_1.newErrorResponse({
        context: "takeServer",
        name: "refuseRequest",
        message: "refuseRequest",
        httpCode: 403,
        more: moreInfo
    }, transactionId, false);
    httpResponse.writeHead(response.code, response.headers);
    httpResponse.end(response.body);
};
const WaitBodyLoad = async function (httpRequest_IncomingMessage, limitation) {
    return new Promise(async (resolve, reject) => {
        let maxBodySize = 0;
        let idleTimeout = 5;
        let wholeTimeout = 30;
        if (typeof (limitation) === "number") {
            maxBodySize = limitation;
        }
        else {
            maxBodySize = limitation.maxSize;
            idleTimeout = limitation.idle;
            wholeTimeout = limitation.whole;
        }
        let terminated = false;
        const postChunks = [];
        let postChunkSize_KB = 0;
        const wholeTimer = setTimeout(() => {
            if (!terminated) {
                terminated = true;
                reject("EXCEED_MAXIMUM_WHOLE_TIME_LIMIT");
            }
        }, wholeTimeout * 1000);
        let idlewholeTimer;
        const idleDetector = () => {
            clearTimeout(idlewholeTimer);
            idlewholeTimer = setTimeout(() => {
                if (!terminated) {
                    terminated = true;
                    reject("EXCEED_MAXIMUM_IDLE_TIME_LIMIT");
                }
            }, idleTimeout * 1000);
        };
        idleDetector();
        httpRequest_IncomingMessage.on('data', (chunk) => {
            idleDetector();
            if (!terminated) {
                let nextPostChunkSize_KB = postChunkSize_KB + (chunk.byteLength / 1024);
                if (typeof (maxBodySize) === "number" && nextPostChunkSize_KB > maxBodySize) {
                    terminated = true;
                    reject("EXCEED__MAXIMUM_POST_BODY_LIMIT");
                }
                postChunks.push(chunk);
                postChunkSize_KB = nextPostChunkSize_KB;
            }
        });
        httpRequest_IncomingMessage.on('end', function () {
            const finalBuffer = Buffer.concat(postChunks);
            clearTimeout(wholeTimer);
            clearTimeout(idlewholeTimer);
            resolve(finalBuffer);
        });
    });
};
const startProcessor = async function (httpRequest, httpResponse, thisProcessorEntrance) {
    let response;
    try {
        response = await (new thisProcessorEntrance.handle()).run(httpRequest);
    }
    catch (error) {
        {
            console.error("handle 抛出错误", error);
        }
        let errMessage = "That's all we know.";
        let report = {
            message: "undef",
            stack: "undef",
        };
        if (error instanceof Error) {
            if (typeof (error.stack) === "string") {
                report.stack = error.stack;
            }
            if (typeof (error.message) === "string") {
                report.message = error.message;
            }
        }
        else if (typeof (error) === "string") {
            errMessage = `${error} ${errMessage}`;
        }
        let errId = 13522;
        errMessage = `服务器内部错误:${thisProcessorEntrance.name}(${errId})`;
        let err = {
            name: Error.name,
            context: thisProcessorEntrance.name,
            errorCode: "HANDLE_CATCH",
            httpCode: 500,
            message: errMessage,
            report,
        };
        console.log("ERR", makeResponse_1.newErrorResponse(err, httpRequest.transactionId, false));
        response = makeResponse_1.newErrorResponse(err, httpRequest.transactionId, false);
    }
    if (typeof (httpRequest.headers.origin) === "string") {
        response.headers["Access-Control-Allow-Origin"] = httpRequest.headers.origin;
        response.headers["Access-Control-Allow-Credentials"] = "true";
    }
    httpResponse.writeHead(response.code, response.headers);
    if (typeof (response.body) === "string") {
        httpResponse.end(response.body, "utf-8", () => { });
    }
    else if (response.body instanceof ArrayBuffer) {
        const buffer = Buffer.from(response.body);
        httpResponse.end(buffer, "utf-8", () => { });
    }
    else {
        httpResponse.end("没开发好");
    }
    return true;
};
const OptionReply = function (httpRequest_IncomingMessage, httpResponse, transactionId) {
    const allowMethods = httpRequest_IncomingMessage.headers["access-control-request-method"] || "";
    const allowHeaders = httpRequest_IncomingMessage.headers["access-control-request-headers"] || "";
    let response;
    if (httpRequest_IncomingMessage.headers.origin && accessAllowedOrigin_1.IsAllowedOrigin(httpRequest_IncomingMessage.headers.origin)) {
        response = makeResponse_1.newHttpResponse("", {
            transactionId, headers: {
                "Access-Control-Allow-Origin": httpRequest_IncomingMessage.headers.origin,
                "Access-Control-Allow-Credentials": "true",
                "Access-Control-Allow-Method": allowMethods,
                "Access-Control-Allow-Headers": allowHeaders,
            }
        });
    }
    else {
        response = makeResponse_1.newHttpResponse("", { transactionId, status: 403 });
    }
    httpResponse.writeHead(response.code, response.headers);
    httpResponse.end(response.body);
};
function takeServer(server) {
    const DEBUG_DIS_ORIGIN_CHECK = true;
    server.on('request', async (httpRequest_IncomingMessage, httpResponse) => {
        const transactionId = transactionId_1.MakeTransactionId();
        if (httpRequest_IncomingMessage.method === "OPTIONS") {
            OptionReply(httpRequest_IncomingMessage, httpResponse, transactionId);
            return;
        }
        if (!DEBUG_DIS_ORIGIN_CHECK) {
            const isAllowedOrigin = accessAllowedOrigin_1.IsAllowedOrigin(httpRequest_IncomingMessage.headers.origin);
            if (!isAllowedOrigin) {
                refuseRequest(transactionId, httpResponse, "OriginNotAllowed");
                return;
            }
        }
        const domain = httpRequest_IncomingMessage.headers.host || "undefined-domian.reserved.brokendreams.cloud";
        const thisURL = new URL(`https://${domain}${httpRequest_IncomingMessage.url}`);
        let pathArray = thisURL.pathname.split("/");
        thisURL.searchParams;
        pathArray.shift();
        pathArray = pathArray.filter((pathText) => pathText.length > 0);
        const url = {
            host: String(thisURL.host),
            hostname: String(thisURL.hostname),
            href: String(thisURL.href),
            url: String(httpRequest_IncomingMessage.url),
            pathname: thisURL.pathname,
            pathnameArray: pathArray,
            restPathnameArray: [],
            search: thisURL.search,
            searchParams: thisURL.searchParams,
        };
        const remote = {
            address: String(httpRequest_IncomingMessage.socket.remoteAddress),
            family: RemoteFamilyTransform(String(httpRequest_IncomingMessage.socket.remoteFamily)),
            port: typeof (httpRequest_IncomingMessage.socket.remotePort) === "number" && httpRequest_IncomingMessage.socket.remotePort > 0 ? httpRequest_IncomingMessage.socket.remotePort : 0,
        };
        const userAccess = await userAccessCheck_1.UserAccessCheck(httpRequest_IncomingMessage);
        const EMPTY_BODY = Buffer.alloc(0);
        const RouterFinderResult = router_1.RouterFinder(url.pathnameArray);
        url.restPathnameArray = RouterFinderResult.restPathnameArray;
        const thisProcessorEntrance = RouterFinderResult.processor;
        const inheritedAccess = RouterFinderResult.inheritedAccess;
        const httpRequest = {
            url,
            remote,
            user: userAccess,
            body: EMPTY_BODY,
            transactionId,
            headers: httpRequest_IncomingMessage.headers,
            method: httpRequest_IncomingMessage.method,
            IncomingMessage: httpRequest_IncomingMessage,
        };
        for (let nodeAccess of inheritedAccess) {
            if (Array.isArray(nodeAccess) && nodeAccess.length > 0) {
                if (!nodeAccess.includes(httpRequest.user.level)) {
                    refuseRequest(transactionId, httpResponse, "AccessNotAllowed");
                    return;
                }
            }
        }
        try {
            let bodyLimit = 0;
            if (typeof (thisProcessorEntrance.acceptBody) === "number") {
                bodyLimit = thisProcessorEntrance.acceptBody;
            }
            const postBody = await WaitBodyLoad(httpRequest_IncomingMessage, bodyLimit);
            httpRequest.body = postBody;
        }
        catch (error) {
            refuseRequest(transactionId, httpResponse, "PostNotAllowed");
            return;
        }
        startProcessor(httpRequest, httpResponse, thisProcessorEntrance);
    });
}
exports.takeServer = takeServer;
//# sourceMappingURL=takeServer.js.map