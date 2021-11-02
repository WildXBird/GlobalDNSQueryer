import { Server as _httpServer, IncomingMessage, ServerResponse } from "http";
import { UserAccessCheckResult, userAccessLevel } from "./users";
import { APIProcessor_Type } from "types/api"

//////create Server 类型/////
export type Server = _httpServer

/** 增强了一下 server IncomingMessage 类型,不可修改 */
type HttpRequestExtends = {
    /** 不含域名的 URL 信息  */
    url: URL,
    /** 来访人网络基本信息  */
    remote: RemoteVisiting,
    /**  请求人相关信息(来自token)  */
    user: UserAccessCheckResult,
    /**  请求的 requestBody  */
    body: Buffer,
    /**  请求ID  */
    transactionId: string,
    /**  请求headers Object */
    headers: IncomingMessage["headers"],
    /**  请求方法  */
    method: IncomingMessage["method"],
    /**  原始IncomingMessage  */
    IncomingMessage: IncomingMessage
}

/** 增强版的 HTTP.Server IncomingMessage */
export type HttpRequest = HttpRequestExtends

/** HTTP.Server ServerResponse */
export type HttpServerResponse = ServerResponse

/** 数组形式的可枚举 URL PathName */
export type PathArray = string[]

/** 本系统中的通用 URL 类型 */
export type URL = {
    /** 域,可能含端口等 */
    host: string,
    /** 域,仅域名 */
    hostname: string,
    /** 含域的 完整URL */
    href: string,
    /** 不含域的 完整URL */
    url: string,
    /**pathname */
    pathname: string,
    /**pathname数组形式,去除了空项目 */
    pathnameArray: PathArray,
    /**pathname数组形式,去除了空项目和在路由匹配时用到的pathname
     * 
     * 如果正好完全匹配，数组将为空
     * 
     * 如果 /api/login/account => /api/login
     * 
     * 则   ["account"]
     */
    restPathnameArray: PathArray,
    /**search字段，以?开始 */
    search: string,
    /** URLSearchParams对象 */
    searchParams: URLSearchParams,
}

export type Remote = {
    address: string
    family: RemoteFamily
    port: number
}
/** remoteFamily优化 'IPv4' 或 'IPv6'  */
export type RemoteFamily = 'IPv4' | 'IPv6'

/** 远程客户端网络基本信息 */
export type RemoteVisiting = {
    /** 远程 IP 地址的字符串表示形式。 
     * 
     * 例如，'74.125.127.100' 或 '2001:4860:a005::68'。  */
    address: IncomingMessage["socket"]["remoteAddress"]
    /** 远程 IP 系列的字符串表示形式。 'IPv4' 或 'IPv6'。 */
    family: "IPv4" | "IPv6" | undefined
    /**  远程端口的数字表示。 例如，80 或 21。 */
    port: IncomingMessage["socket"]["remotePort"]
}

/** 全局处理器路由表类型 */
export type RouterTable = RouterTableItem[]
/** 单项处理器路由配置信息（路由表） */
type RouterTableItem = {
    /** 相对路径，必须以“./”开头 */
    path: string,
    /** 
     * 表示是否严格匹配，即 location 是否和 path 完全对应，上不区分大小写。
     * @例子
     * url 为 /A/b 时匹配失败：
     * 
     * { path: '/A', exact: true },
     * @例子
     * url 为 /A/b 时匹配成功
     * 
     * { path: '/A' },
     * 
     * @默认 false
     */
    exact?: boolean,
    /** 子目录，选填 */
    routes?: RouterTable
} & BaseRouterTableItem

/** 项目body接受配置
 * 
 * 可设置空闲时间和全程时间
 * 
 * 或只设置一个maxSize(KB)，那么超时将使用默认值:
 * 
 * whole = 30, 秒 idle = 5秒
 */
export type BodyRecieveLimitation = {
    /**body接收最长空闲时间，单位秒 */
    idle: number,
    /**body接收总最长时间，单位秒 */
    whole: number,
    /**最大接受的body大小，单位KB */
    maxSize: number,
} | number

/** 单项处理器路由配置信息（基本） */
export type BaseRouterTableItem = {
    /** 处理器实体
     * 
     * 一个被Import的对象，必须包含一个handle */
    processor?: ProcessorHandle,
    // /** 处理的名字，不应该重复，应该与Import变量名字保持一致，用来标识context */
    // name?: string,
    /** 最大接受的body相关配置
     * 
     * 只设置一个maxSize(KB)，那么超时将使用默认值 30 秒
     * @default false
     */
    acceptBody?: BodyRecieveLimitation,
    /** 什么权限等级的用户可以使用此处理器，为空数组时表示任何人可以访问
     * @default []
     */
    access?: userAccessLevel[],
}

/** 内置处理器表类型 */
export type BuiltInProcessors = {
    /** 内置的处理器 */
    "404": BaseRouterTableItem & {
        // name: string
        processor: ProcessorHandle
    },
    // [key: string]: BaseRouterTableItem & {
    //     name: string
    //     processor: ProcessorImports
    // }
}

/** 处理器，保护必要处理器信息，RouterFinder返回这个，在RouterFinder的处理器相关信息都应该用这个处理 */
export type Processor = {
    /** 处理器入口，Promise，返回一个 HttpResponse 对象 */
    handle: ProcessorHandle,
    /** 处理的名字，用来标识context
     * 
     *  !!此名称在服务崩溃时会暴露给用户，不应包含敏感信息
     */
    name: string,
    /** 请求处理的超时时间，默认为 */
    timeout?: number,
    /** 最大接受的body大小，不设为不接受，单位KB */
    acceptBody?: BodyRecieveLimitation,
    /** 什么权限等级的用户可以使用此处理器，为空数组时表示任何人可以访问
 * @默认 []
 */
    access: userAccessLevel[],
}

/** 路由表内部使用，处理器对象(class) */
export type ProcessorHandle = typeof APIProcessor_Type

/** 可被接受的普通HTTP响应 */
export type HttpResponse = {
    code: HttpResponseCode,
    headers: HttpResponseHeader,
    body: HttpResponseBody,
}
export type HttpResponseHeader = {
    // server: "BrokenDreams.Cloud Gateway /0.0.1"
    // "bdc-transactionid": string
    // date: Date
} & ExHeaders & IncomingMessage["headers"]


type ExHeaders = {
    "bdc-forwarded-by"?: string
    /*    
    Cloudflare 标头	描述
   
    cf-cache-status：命中	您的资源已在 Cloudflare 的缓存中找到。这意味着它先前已从您的原始服务器访问并加载到缓存中。它都没有过期。
  
    cf-cache-status: 未命中	Cloudflare 在缓存中查找您的资源，但没有找到。Cloudflare 返回到您的源服务器以检索资源。下次访问此资源时，其状态应为 HIT。
   
    cf-cache-status: BYPASS	Cloudflare 已被指示不要缓存此资产。它是直接从原产地供应的。这通常是因为像现有的 NO-CACHE 标头这样的东西受到尊重。
   
    cf-cache-status: 过期	Cloudflare 之前已检索过此资源，但其缓存已过期。Cloudflare 将返回原点以再次检索此资源。下一个资源是访问它的状态应该是 HIT
   
    cf-cache-status: 动态	默认情况下不缓存此资源，并且没有配置显式设置来缓存它。当 Cloudflare 处理 POST 请求时，您会经常看到这一点。此请求将始终发往原点。 
    */
    "x-cascade-cache"?: "HIT" | "MISS" | "BYPASS" | "EXPIRED" | "DYNAMIC"
    "x-cascade-hash"?: "cba924a7243a9929c2fe6b792063b8d642bd79e990a8df4794a77fedb71d75d2"
}

export type HttpResponseCode = number
/**  HttpResponse 的 正文
 * @参见 https://developer.mozilla.org/zh-CN/docs/Web/API/ReadableStream
  */
export type HttpResponseBody = string | ArrayBuffer | ReadableStream

/**标准的内部错误信息，当包含有report时应当计入日志 */
export type ServiceError = Error & {
    context: string,
    httpCode?: number,
    errorCode?: number | string,
    more?: string,
    report?: {
        message?: string,
        stack?: string,
    },
}
/**  HttpResponse 正文*/
export type ResponseBody = ArrayBuffer | ReadableStream | URLSearchParams | string
/**  HttpResponse 头和状态码*/
export type ResponseInputInit = {
    status?: number,
    // statusText?: string,
    transactionId: string,
    headers?: HttpRequest["headers"],
}


