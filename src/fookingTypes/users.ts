
/** 用于大致权限区分的用户等级划分 */
export type userAccessLevel = "blocked" | "anonymous" | "freeUser" | "paidUser" | "admin" | "master"

/** 用户唯一UID，为0时为未登录 */
export type uid = number

/** 经过确定的请求人身份信息 */
export type UserAccessCheckResult = {
    /** 用户等级 */
    readonly level: userAccessLevel,
    readonly uid: uid,
}
/** 用户信息 */
export type UserInfo = {
    readonly uid: number
    readonly userName: string
    readonly email: string | undefined
    readonly access: userAccessLevel
}
