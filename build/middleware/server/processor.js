"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ObjectAPI_Prototype = exports.APIProcessor_Prototype = void 0;
const makeResponse_1 = require("middleware/server/makeResponse");
class APIProcessor_Prototype {
    constructor(name, options = {}) {
        this.binaryBody = Buffer.alloc(0);
        this.jsonBody = {};
        this.name = name;
        this.useBinaryBody = options.binaryBody || false;
    }
    async run(httpRequest) {
        this.binaryBody = httpRequest.body;
        if (!this.useBinaryBody && this.binaryBody.length > 0) {
            try {
                this.jsonBody = JSON.parse(this.binaryBody.toString("utf-8"));
            }
            catch (error) {
                return makeResponse_1.SimpleErr(httpRequest, "POST_BODY_PARSE_ERR", "APIProcessor.run.jsonBody");
            }
        }
        const transactionId = httpRequest.transactionId;
        let result = await this.handle(httpRequest);
        if (result.error) {
            return makeResponse_1.newErrorResponse(result.data, transactionId, !!result.data.report);
        }
        else {
            const code = result.code || 200;
            const headers = {
                ...(result.headers || {}),
            };
            let bodyString = "";
            if (result.body) {
                const body = result.body;
                bodyString = JSON.stringify(body);
            }
            return makeResponse_1.newHttpResponse(bodyString, {
                transactionId,
                status: code,
                headers
            });
        }
    }
    async handle(httpRequest) {
        return await this.report("日志错误信息", "HANDLE_NOT_SET", 500, "程序未被定义");
    }
    async error(errorCode, httpCode, errorMessage) {
        let errorBody = {
            ...new Error(errorMessage),
            message: errorMessage || "",
            errorCode: errorCode || "UNDEF",
            httpCode: httpCode || 400,
            context: this.name
        };
        return {
            error: true,
            data: errorBody
        };
    }
    async report(reportMessage, errorCode, httpCode, errorMessage) {
        let errorBody = {
            ...new Error(errorMessage),
            message: errorMessage || "",
            errorCode: errorCode || "SYSTEM-ERROR",
            httpCode: httpCode || 500,
            context: this.name,
            report: {
                message: reportMessage,
                stack: new Error().stack
            }
        };
        return {
            error: true,
            data: errorBody
        };
    }
}
exports.APIProcessor_Prototype = APIProcessor_Prototype;
class ObjectAPI_Prototype extends APIProcessor_Prototype {
    constructor(name, options = {}) {
        super(name, {
            binaryBody: options.binaryBody
        });
    }
    async handle(httpRequest) {
        const action = httpRequest.url.restPathnameArray[0];
        if (typeof (action) !== "string") {
            return await this.error("OBJECT_ACTION_NOT_SPECIFIED", 404);
        }
        const actionLowerCased = action.toLocaleLowerCase();
        const restPathnameArray = httpRequest.url.restPathnameArray;
        restPathnameArray.shift();
        const handleResult = async (input) => {
            if (input.error === true) {
                const errorCode = input.data.errorCode ? String(input.data.errorCode) : "OBJECT_ACTION_UNKNOW_ERROR";
                const httpCode = input.data.httpCode ? input.data.httpCode : 500;
                return await this.error(errorCode, httpCode);
            }
            const response = {
                code: 200,
                body: input.data,
            };
            return response;
        };
        switch (actionLowerCased) {
            case "add":
                return handleResult(await this.add(restPathnameArray, httpRequest));
            case "update":
                return handleResult(await this.update(restPathnameArray, httpRequest));
            case "get":
                return handleResult(await this.get(restPathnameArray, httpRequest));
            case "delete":
                return handleResult(await this.delete(restPathnameArray, httpRequest));
            default:
                return await this.error("OBJECT_ACTION_NOT_FOUND", 404);
        }
    }
    async add(restPathnameArray, httpRequest) {
        return {
            data: {}
        };
    }
    async update(restPathnameArray, httpRequest) {
        return {
            data: {}
        };
    }
    async get(restPathnameArray, httpRequest) {
        return {
            data: {}
        };
    }
    async delete(restPathnameArray, httpRequest) {
        return {
            data: {}
        };
    }
}
exports.ObjectAPI_Prototype = ObjectAPI_Prototype;
//# sourceMappingURL=processor.js.map