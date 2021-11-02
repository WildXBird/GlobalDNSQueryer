"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handle = void 0;
const processor_1 = require("middleware/server/processor");
class handle extends processor_1.APIProcessor_Prototype {
    constructor() {
        super("debug handle");
    }
    async handle(httpRequest) {
        return {
            code: 404,
            headers: {
                server: "BrokenDreams.Cloud Gateway /0.0.1",
                "bdc-forwarded-by": "20404",
            },
        };
    }
}
exports.handle = handle;
//# sourceMappingURL=404.js.map