import { v4 as uuidv4 } from "uuid"
/**为每个请求分配一个第一无二的TransactionId */
export function MakeTransactionId() {
    return uuidv4()
}