import { HttpRequest, HttpResponse } from "types/server"
import { APIProcessor_Prototype } from "middleware/server/processor"
import { newHttpResponse, newErrorResponse } from "middleware/server/makeResponse"
import { APIHandleResult, ErrorMessage, APIProcessorName } from "types/api"
import { encode as DNSPacketEncode, decode as DNSPacketDecode, RECURSION_DESIRED } from "dns-packet"
import { createSocket } from "dgram"



const getIP = function (domain: string, DNSServer: string = "8.8.8.8") {
    return new Promise<string[]>(async (resolve, reject) => {
        const socket = createSocket('udp4')
        const buf = DNSPacketEncode({
            type: 'query',
            id: 1,
            flags: RECURSION_DESIRED,
            questions: [{
                type: 'A',
                name: domain
            }]
        })
        socket.on('message', message => {
            const ipList = []
            const reply = DNSPacketDecode(message)
            if (Array.isArray(reply.answers)) {
                for (let item of reply.answers) {
                    if (item.type === "A") {
                        ipList.push(item.data)
                    }
                }
            }
            resolve(ipList)
            socket.close()
        })
        socket.send(buf, 0, buf.length, 53, DNSServer)
        setTimeout(() => {
            resolve([])
            try {
                socket.close()
            } catch (error) {

            }

        }, 1000);
    })
}
// https://public-dns.info/
const dnsList = [
    "199.255.137.34",
    "82.146.26.2",
    "94.236.218.254",
    "8.8.8.8",
    "151.80.222.79",
    "200.11.52.202",
    "200.62.147.66",
    "91.239.100.100",
    "89.233.43.71",
    "80.179.155.145",
    "180.76.76.76",
    "199.85.126.10",
    "203.81.75.37",
    "161.200.96.9",
    "85.132.85.85",
    "103.123.226.10",
    "62.212.154.152",
    "216.187.93.250",
    "66.199.45.225",
    "177.131.114.86",
    "149.112.112.112",
    "31.24.200.4",
    "190.105.152.28",
]
export class handle extends APIProcessor_Prototype {
    constructor() {
        super("debug handle")
    }
    async handle(httpRequest: HttpRequest): Promise<APIHandleResult<{
        state: string
        result: string[]
    }>> {
        const finalResult = new Set<string>()
        for (let item of dnsList) {
            console.log("SENDING", "ubistatic3-a.akamaihd.net", item)
            const result = await getIP("ubistatic3-a.akamaihd.net", item)
            console.log("GOT:", result)
            for (let ip of result) {
                finalResult.add(ip)
            }
        }
        return {
            body: {
                state: "ok",
                result: [...finalResult],
            }
        }
    }
}
