import {
    HttpRequest, HttpResponse, ServiceError, ResponseBody,
    ResponseInputInit,
} from "types/server"
import { stateCodes } from "./codes"
import { ENV } from "../../config/config"



/**  创建一个标准的 HttpResponse
 * @see https://developer.mozilla.org/zh-CN/docs/Web/API/Response/Response
*/
export function newHttpResponse(bodyInput: ResponseBody, init: ResponseInputInit): HttpResponse {
    let statusCode = 200
    let headers: HttpRequest["headers"] = {
        server: "BrokenDreams.Cloud Gateway /0.0.1",
        "bdc-forwarded-by": "660",
        "bdc-transaction-id": init.transactionId,
    }
    if (typeof (init) === "object") {
        if (typeof (init.status) === "number") {
            if (typeof (stateCodes[String(init.status)]) !== "undefined") {
                statusCode = init.status
            }
        }
        if (typeof (init.headers) === "object") {
            headers = { ...headers, ...init.headers }
        }

    }
    let Body: HttpResponse["body"] = ""
    switch (typeof bodyInput) {
        case "object":
            if (bodyInput instanceof ArrayBuffer) {
                Body = bodyInput
            } else if (bodyInput instanceof ReadableStream) {
                Body = bodyInput
            } else if (bodyInput instanceof URLSearchParams) {
                Body = bodyInput.toString()
            } else {
                console.log("无效的HttpResponse.bodyInput,获得object")
                return newErrorResponse({
                    name: "TypeError",
                    message: "无效的HttpResponse.bodyInput,获得object",
                    context: "HttpResponse"
                }, init.transactionId)
            }
            break;
        case "string":
            Body = bodyInput
            break;
        case "undefined":
            Body = ""
            break;
        default:
            console.log("无效的HttpResponse.bodyInput", typeof bodyInput)
            return newErrorResponse({
                name: "TypeError",
                message: "无效的HttpResponse.bodyInput",
                context: "HttpResponse"
            }, init.transactionId)
    }

    return {
        code: statusCode,
        body: Body,
        headers,
    }
}
/**  创建一个标准 Error 的 HttpResponse,当ignore不为false时写入日志系统
 * 
 * report数据不会被发送给客户端
 * 
 * 日志系统待开发：
 * 
 * @see https://support.huaweicloud.com/productdesc-smn/smn_price.html
  */
export function newErrorResponse(input: ServiceError, transactionId: string, ignore?: boolean): HttpResponse {
    let errorBody = {
        moreInfo: input.more || "",
        errorCode: input.errorCode || 1,
        httpCode: input.httpCode || 500,
        errorContext: input.context || "unkonw",
        message: input.message || "unknow",
        environment: ENV,
        transactionTime: new Date().toISOString(),
        transactionId
    }
    if (input.report) {
        console.error("代表计入日志", input.report, input)
    }
    return newHttpResponse(JSON.stringify(errorBody), {
        transactionId, status: errorBody.httpCode, headers: {
            "Content-Type": "application/json; charset=UTF-8"
        }
    })
}
export function SimpleErr(httpRequest: HttpRequest, errorMessage: string, errorContext: string, httpCode?: number, errorCode?: string, ignore: boolean = true): HttpResponse {
    let errorBody: ServiceError = {
        ...new Error(errorMessage), ...{
            message: errorMessage,
            errorCode: errorCode || undefined,
            httpCode: httpCode || 412,
        },
        context: errorContext
    }
    return newErrorResponse(errorBody, httpRequest.transactionId, ignore)
}