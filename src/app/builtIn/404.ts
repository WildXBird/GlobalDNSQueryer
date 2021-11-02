import { HttpRequest, HttpResponse } from "../../fookingTypes/server"
import { APIHandleResult } from "types/api"
import { APIProcessor_Prototype } from "middleware/server/processor"

// export async function handle(httpRequest: HttpRequest):Promise<HttpResponse> {
//         return ({
//             code: 404,
//             headers: {
//                 server: "BrokenDreams.Cloud Gateway /0.0.1",
//                 "bdc-forwarded-by": "20404",
//             },
//             body: ""
//         })
// }

export class handle extends APIProcessor_Prototype {
    constructor() {
        super("debug handle")
    }
    async handle(httpRequest: HttpRequest): Promise<APIHandleResult<any>> {
        return {
            code: 404,
            headers: {
                server: "BrokenDreams.Cloud Gateway /0.0.1",
                "bdc-forwarded-by": "20404",
            },
        }
    } 

}
// {
//     type _EvenNumber = "EvenNumber"
//     class EvenNumber {
//         value: number;
//         toNumber: () => number;
//         get [Symbol.toStringTag](): _EvenNumber {
//             return "EvenNumber";
//         }
//         constructor(number: number) {
//             let num = parseInt(String(number / 2))
//             this.value = num;
//             this.toString = () => { return String(num) };
//             this.toNumber = () => { return num };
//         }
//     }
//     interface EvenNumber {
//         readonly [Symbol.toStringTag]: "EvenNumber";
//     }

//     let num: EvenNumber = new EvenNumber(22)
//     console.log("这是双数", num.value)
// }