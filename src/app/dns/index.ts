import { HttpRequest, HttpResponse } from "types/server"
import { APIProcessor_Prototype } from "middleware/server/processor"
import { newHttpResponse, newErrorResponse } from "middleware/server/makeResponse"
import { APIHandleResult, ErrorMessage, APIProcessorName } from "types/api"
import { encode as DNSPacketEncode, decode as DNSPacketDecode, RECURSION_DESIRED } from "dns-packet"
import { createSocket } from "dgram"
import { Get_DNS_SERVERS } from "config/dnsServers"

// https://public-dns.info/
const dnsList = Get_DNS_SERVERS()

const resolveIPFromDNS = function (domain: string, DNSServer: string = "8.8.8.8") {
    let resolved = false
    return new Promise<string[] | false>(async (resolve, reject) => {
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
            resolved = true
        })
        socket.send(buf, 0, buf.length, 53, DNSServer)
        setTimeout(() => {
            if (!resolved) {
                resolve(false)
                socket.close()
            }
        }, 2500);
    })
}
const getIPs = function (domain: string) {
    const tasks: Promise<string[] | false>[] = []
    for (let item of dnsList) {
        tasks.push(resolveIPFromDNS(domain, item))
    }
    const ips = new Set<string>()
    let serverCount = 0
    return new Promise<{
        ips: string[],
        servers: number
    }>(async (resolve, reject) => {
        Promise.all(tasks).then((values) => {
            for (let results of values) {
                if (results !== false) {
                    serverCount++
                    for (let ip of results) {
                        ips.add(ip)
                    }
                }
            }
            resolve({
                ips: [...ips],
                servers: serverCount,
            });
        });

    })
}

export class handle extends APIProcessor_Prototype {
    constructor() {
        super("debug handle")
    }
    async handle(httpRequest: HttpRequest): Promise<APIHandleResult<{
        state: string
        domain: string
        result: string[]
        servers: number
        takes: number
    }>> {
        const domain = "ubistatic3-a.akamaihd.net"
        // const domain = "gradle-dn.com"
        const startTime = new Date().valueOf()
        const finalResult = new Set<string>()
        const result = await getIPs(domain)
        // const result = await getIPs("seo-project.pages.dev")
        return {
            body: {
                state: "done",
                domain: domain,
                result: result.ips,
                servers: result.servers,
                takes: new Date().valueOf() - startTime
            }
        }
    }
}
