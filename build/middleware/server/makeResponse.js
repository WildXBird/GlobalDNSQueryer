"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SimpleErr = exports.newErrorResponse = exports.newHttpResponse = void 0;
const codes_1 = require("./codes");
const config_1 = require("../../config/config");
function newHttpResponse(bodyInput, init) {
    let statusCode = 200;
    let headers = {
        server: "BrokenDreams.Cloud Gateway /0.0.1",
        "bdc-forwarded-by": "660",
        "bdc-transaction-id": init.transactionId,
    };
    if (typeof (init) === "object") {
        if (typeof (init.status) === "number") {
            if (typeof (codes_1.stateCodes[String(init.status)]) !== "undefined") {
                statusCode = init.status;
            }
        }
        if (typeof (init.headers) === "object") {
            headers = { ...headers, ...init.headers };
        }
    }
    let Body = "";
    switch (typeof bodyInput) {
        case "object":
            if (bodyInput instanceof ArrayBuffer) {
                Body = bodyInput;
            }
            else if (bodyInput instanceof ReadableStream) {
                Body = bodyInput;
            }
            else if (bodyInput instanceof URLSearchParams) {
                Body = bodyInput.toString();
            }
            else {
                console.log("无效的HttpResponse.bodyInput,获得object");
                return newErrorResponse({
                    name: "TypeError",
                    message: "无效的HttpResponse.bodyInput,获得object",
                    context: "HttpResponse"
                }, init.transactionId);
            }
            break;
        case "string":
            Body = bodyInput;
            break;
        case "undefined":
            Body = "";
            break;
        default:
            console.log("无效的HttpResponse.bodyInput", typeof bodyInput);
            return newErrorResponse({
                name: "TypeError",
                message: "无效的HttpResponse.bodyInput",
                context: "HttpResponse"
            }, init.transactionId);
    }
    return {
        code: statusCode,
        body: Body,
        headers,
    };
}
exports.newHttpResponse = newHttpResponse;
function newErrorResponse(input, transactionId, ignore) {
    let errorBody = {
        moreInfo: input.more || "",
        errorCode: input.errorCode || 1,
        httpCode: input.httpCode || 500,
        errorContext: input.context || "unkonw",
        message: input.message || "unknow",
        environment: config_1.ENV,
        transactionTime: new Date().toISOString(),
        transactionId
    };
    if (input.report) {
        console.error("代表计入日志", input.report, input);
    }
    return newHttpResponse(JSON.stringify(errorBody), {
        transactionId, status: errorBody.httpCode, headers: {
            "Content-Type": "application/json; charset=UTF-8"
        }
    });
}
exports.newErrorResponse = newErrorResponse;
function SimpleErr(httpRequest, errorMessage, errorContext, httpCode, errorCode, ignore = true) {
    let errorBody = {
        ...new Error(errorMessage), ...{
            message: errorMessage,
            errorCode: errorCode || undefined,
            httpCode: httpCode || 412,
        },
        context: errorContext
    };
    return newErrorResponse(errorBody, httpRequest.transactionId, ignore);
}
exports.SimpleErr = SimpleErr;
//# sourceMappingURL=makeResponse.js.map