import { APIHandleResult, ObjectAPIChildHandleResult, ErrorMessage, APIProcessorName, APIHandleError } from "types/api"
import { HttpRequest, HttpResponse, ServiceError } from "types/server"
import { newErrorResponse, newHttpResponse, SimpleErr } from "middleware/server/makeResponse"
import { JSONable } from "types/baseType"

/**API类处理器原型 */
export class APIProcessor_Prototype {
    readonly name: string
    readonly useBinaryBody: boolean
    protected binaryBody: Buffer = Buffer.alloc(0)
    protected jsonBody: JSONable = {}
    constructor(name: APIProcessorName, options: {
        binaryBody?: boolean
    } = {}) {
        this.name = name
        this.useBinaryBody = options.binaryBody || false
    }

    public async run(httpRequest: HttpRequest): Promise<HttpResponse> {
        this.binaryBody = httpRequest.body
        if (!this.useBinaryBody && this.binaryBody.length>0) {
            try { this.jsonBody = JSON.parse(this.binaryBody.toString("utf-8")) } catch (error) {
                return SimpleErr(httpRequest, "POST_BODY_PARSE_ERR", "APIProcessor.run.jsonBody")
            }
        }

        const transactionId = httpRequest.transactionId
        let result = await this.handle(httpRequest)
        if (result.error) {
            return newErrorResponse(result.data, transactionId, !!result.data.report)
        } else {
            const code = result.code || 200
            const headers = {
                ... (result.headers || {}),
                // x-served-by
            }

            let bodyString = ""
            if (result.body) {
                const body: JSONable = result.body
                bodyString = JSON.stringify(body)
            }

            return newHttpResponse(bodyString, {
                transactionId,
                status: code,
                headers
            })
        }
    }

    protected async handle(httpRequest: HttpRequest): Promise<APIHandleResult<JSONable>> {
        return await this.report("日志错误信息", "HANDLE_NOT_SET", 500, "程序未被定义")
    }
    /**创建一个业务上的错误，不计入日志，返回给客户端 */
    async error(errorCode: string, httpCode?: number, errorMessage?: ErrorMessage): Promise<APIHandleError> {
        let errorBody: ServiceError = {
            ...new Error(errorMessage),
            message: errorMessage || "",
            errorCode: errorCode || "UNDEF",
            httpCode: httpCode || 400,
            context: this.name
        }
        return {
            error: true,
            data: errorBody
        }
    }
    /**创建一个业务或逻辑上的错误，并计入日志，report之外的信息将返回给客户端 */
    async report(reportMessage: string, errorCode: string, httpCode?: number, errorMessage?: ErrorMessage): Promise<APIHandleError> {
        let errorBody: ServiceError = {
            ...new Error(errorMessage),
            message: errorMessage || "",
            errorCode: errorCode || "SYSTEM-ERROR",
            httpCode: httpCode || 500,
            context: this.name,
            report: {
                message: reportMessage,
                stack: new Error().stack
            }
        }
        return {
            error: true,
            data: errorBody
        }
    }
}

export class ObjectAPI_Prototype extends APIProcessor_Prototype {
    constructor(name: APIProcessorName, options: {
        binaryBody?: boolean
    } = {}) {

        super(name, {
            binaryBody: options.binaryBody
        })
    }


    async handle(httpRequest: HttpRequest): Promise<APIHandleResult<JSONable>> {
        const action = httpRequest.url.restPathnameArray[0]
        if (typeof (action) !== "string") {
            return await this.error("OBJECT_ACTION_NOT_SPECIFIED", 404)
        }
        const actionLowerCased = action.toLocaleLowerCase()

        const restPathnameArray = httpRequest.url.restPathnameArray;
        restPathnameArray.shift()


        const handleResult = async (input: ObjectAPIChildHandleResult<JSONable>): Promise<APIHandleResult<JSONable>> => {

            if (input.error === true) {
                const errorCode = input.data.errorCode ? String(input.data.errorCode) : "OBJECT_ACTION_UNKNOW_ERROR"
                const httpCode = input.data.httpCode ? input.data.httpCode : 500
                return await this.error(errorCode, httpCode)
            }

            const response: APIHandleResult<JSONable> = {
                code: 200,
                body: input.data,
            }
            return response
        }
        switch (actionLowerCased) {
            case "add":
                return handleResult(await this.add(restPathnameArray, httpRequest))
            case "update":
                return handleResult(await this.update(restPathnameArray, httpRequest))
            case "get":
                return handleResult(await this.get(restPathnameArray, httpRequest))
            case "delete":
                return handleResult(await this.delete(restPathnameArray, httpRequest))
            default:
                return await this.error("OBJECT_ACTION_NOT_FOUND", 404)
        }
    }

    async add(restPathnameArray: string[], httpRequest: HttpRequest): Promise<ObjectAPIChildHandleResult<JSONable>> {
        return {
            data: {}
        }
    }

    async update(restPathnameArray: string[], httpRequest: HttpRequest): Promise<ObjectAPIChildHandleResult<JSONable>> {
        return {
            data: {}
        }
    }

    async get(restPathnameArray: string[], httpRequest: HttpRequest): Promise<ObjectAPIChildHandleResult<JSONable>> {
        return {
            data: {}
        }
    }

    async delete(restPathnameArray: string[], httpRequest: HttpRequest): Promise<ObjectAPIChildHandleResult<JSONable>> {
        return {
            data: {}
        }
    }
}