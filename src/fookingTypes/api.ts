import { newErrorResponse, newHttpResponse, SimpleErr } from "middleware/server/makeResponse"
import { JSONable } from "types/baseType"
import { HttpRequest, HttpResponse, ServiceError } from "types/server"
import { APIProcessor_Prototype } from "middleware/server/processor"

export type APIStatus = "ok" | "error"

export type APIHandleResult<T extends JSONable> = {
    error?: false,
    code: HttpResponse["code"],
    headers?: HttpResponse["headers"],
    body?: T,

} | {
    error?: false,
    code?: HttpResponse["code"],
    headers?: HttpResponse["headers"],
    body: T,
} | APIHandleError


export type ObjectAPIChildHandleResult<T extends JSONable> = {
    error?: never,
    data: T,

} | APIHandleError


export type APIHandleError = {
    error: true,
    data: ServiceError
}

/** API处理器名字,公开名称 */
export type APIProcessorName = string

/** API处理器名字,公开名称 */
export type ErrorMessage = string

export class APIProcessor_Type extends APIProcessor_Prototype {
    constructor() {
        super("APIProcessor_Type")
    }
}

