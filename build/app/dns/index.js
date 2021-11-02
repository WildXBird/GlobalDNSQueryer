"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handle = void 0;
const processor_1 = require("middleware/server/processor");
const dns_packet_1 = require("dns-packet");
const dgram_1 = require("dgram");
const dnsServers_1 = require("config/dnsServers");
const dnsList = dnsServers_1.Get_DNS_SERVERS();
const resolveIPFromDNS = function (domain, DNSServer = "8.8.8.8") {
    let resolved = false;
    return new Promise(async (resolve, reject) => {
        const socket = dgram_1.createSocket('udp4');
        const buf = dns_packet_1.encode({
            type: 'query',
            id: 1,
            flags: dns_packet_1.RECURSION_DESIRED,
            questions: [{
                    type: 'A',
                    name: domain
                }]
        });
        socket.on('message', message => {
            const ipList = [];
            const reply = dns_packet_1.decode(message);
            if (Array.isArray(reply.answers)) {
                for (let item of reply.answers) {
                    if (item.type === "A") {
                        ipList.push(item.data);
                    }
                }
            }
            resolve(ipList);
            socket.close();
            resolved = true;
        });
        socket.send(buf, 0, buf.length, 53, DNSServer);
        setTimeout(() => {
            if (!resolved) {
                resolve(false);
                socket.close();
            }
        }, 2500);
    });
};
const getIPs = function (domain) {
    const tasks = [];
    for (let item of dnsList) {
        tasks.push(resolveIPFromDNS(domain, item));
    }
    const ips = new Set();
    let serverCount = 0;
    return new Promise(async (resolve, reject) => {
        Promise.all(tasks).then((values) => {
            for (let results of values) {
                if (results !== false) {
                    serverCount++;
                    for (let ip of results) {
                        ips.add(ip);
                    }
                }
            }
            resolve({
                ips: [...ips],
                servers: serverCount,
            });
        });
    });
};
class handle extends processor_1.APIProcessor_Prototype {
    constructor() {
        super("debug handle");
    }
    async handle(httpRequest) {
        const domain = "ubistatic3-a.akamaihd.net";
        const startTime = new Date().valueOf();
        const finalResult = new Set();
        const result = await getIPs(domain);
        return {
            body: {
                state: "done",
                domain: domain,
                result: result.ips,
                servers: result.servers,
                takes: new Date().valueOf() - startTime
            }
        };
    }
}
exports.handle = handle;
//# sourceMappingURL=index.js.map