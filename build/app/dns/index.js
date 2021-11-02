"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handle = void 0;
const processor_1 = require("middleware/server/processor");
const dns_packet_1 = require("dns-packet");
const dgram_1 = require("dgram");
const getIP = function (domain, DNSServer = "8.8.8.8") {
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
        });
        socket.send(buf, 0, buf.length, 53, DNSServer);
        setTimeout(() => {
            resolve([]);
            try {
                socket.close();
            }
            catch (error) {
            }
        }, 1000);
    });
};
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
];
class handle extends processor_1.APIProcessor_Prototype {
    constructor() {
        super("debug handle");
    }
    async handle(httpRequest) {
        const finalResult = new Set();
        for (let item of dnsList) {
            console.log("SENDING", "ubistatic3-a.akamaihd.net", item);
            const result = await getIP("ubistatic3-a.akamaihd.net", item);
            console.log("GOT:", result);
            for (let ip of result) {
                finalResult.add(ip);
            }
        }
        return {
            body: {
                state: "ok",
                result: [...finalResult],
            }
        };
    }
}
exports.handle = handle;
//# sourceMappingURL=index.js.map