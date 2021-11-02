

let SessionMaker = function (headers, HTTPrequest) {
    const crypto = require('crypto');
    var obj = crypto.createHash('sha256');
    obj.update('1883263');
    var str = obj.digest('hex');//hex是十六进制
    console.log(str);
    return "anonymous"
}
let SessionValidator = function (headers, HTTPrequest) {
    const crypto = require('crypto');
    var obj = crypto.createHash('sha256');
    obj.update('1883263');
    var str = obj.digest('hex');//hex是十六进制
    console.log(str);
    return "anonymous"
}
let loginKeys = [{
    // userInfo:
}]

module.exports = { SessionMaker, SessionValidator }