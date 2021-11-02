(() => {
    // https://www.linchaoqun.com/html/cms/content.jsp?menu=index&id=b7f46354-00b8-41e5-a03c-49cb4318ef72
    const crypto = require("crypto")
    const fs = require("fs")

    /**
     * 固定公私钥并保密
     * 随机生成AESKEY 并加密
     * 随机生成AESIV 并公开
     */

    let RSAencrypt = function (privateKey, buffer) {
        return crypto.privateEncrypt({ key: privateKey, passphrase: '' }, buffer);
    }
    let RSAdecrypt = function (publicKey, encryptData) {
        return crypto.publicDecrypt({ key: publicKey, }, encryptData);
    }

    let AESencrypt = function (key, iv, buffer) {
        const cipher = crypto.createCipheriv('aes-128-cbc', key, iv);
        return cipher.update(buffer, undefined, "base64") + cipher.final("base64");
    }
    let AESdecrypt = function (key, iv, encryptData) {
        const decipher = crypto.createDecipheriv('aes-128-cbc', key, iv);
        return decipher.update(encryptData, "base64", "utf8") + decipher.final('utf8');
    }

    {
        let tokenRawData = JSON.stringify({
            Timestamp: new Date().valueOf(),
            uid: 342332,
            ua: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/92.0.4515.159 Safari/537.36",
            // ua: "409979f1b4f5151f",
            ip: "1.1.1.1"
        })

        const AES_KEY = crypto.randomBytes(16);
        const AES_IV = crypto.randomBytes(16);
        const RSA_PUBLIC_KEY = fs.readFileSync("./public_key", "utf8");
        const RSA_PRIVATE_KEY = fs.readFileSync("./private_Key", "utf8");

        //加密RSAKEY
        let 加密的AESKEY = RSAencrypt(RSA_PRIVATE_KEY, AES_KEY)
        // console.log("加密的AESKEY", 加密的AESKEY)

        //bufferjson 
        let bufferJSon = Buffer.from(tokenRawData)

        //加密正文
        let 加密的正文 = AESencrypt(AES_KEY, AES_IV, bufferJSon)
        // console.log("加密的正文BASE64", 加密的正文)

        let tokenText = JSON.stringify({
            ver: 1,
            env: "Prod",
            typ: "bdt",
            enc: "A128CBC",
            int: "RS256",
            iv: AES_IV.toString("base64"),
            key: 加密的AESKEY.toString("base64"),
            body: 加密的正文
        })

        let base64data = Buffer.from(tokenText).toString('base64')
        console.log("base64data", base64data)
        console.log("----------------------------")

        {
            let tokenTextBuffer = Buffer.from(base64data, "base64").toString("utf8");
            console.log("tokenTextBuffer",tokenTextBuffer)
            let tokenObj = JSON.parse(tokenTextBuffer)
            if ("A128CBC" === tokenObj.enc && "RS256" === "RS256") {
                let aesIv =  Buffer.from(tokenObj.iv, "base64")
                let aesKey = RSAdecrypt(RSA_PUBLIC_KEY, Buffer.from(tokenObj.key, "base64"))
                let rawTokenBody = AESdecrypt(aesKey,aesIv,Buffer.from(tokenObj.body, "base64"))
                console.log("rawTokenBody",rawTokenBody)
            } else {
                //err
            }
        }

        return
    }



    // const AES_KEY = '0132456789abcdef'
    // const AES_IV = 'fedcba9876543210'
    // {
    //     const keyPair = crypto.generateKeyPairSync('rsa', {
    //         modulusLength: 1024,
    //         publicKeyEncoding: {
    //             type: 'spki',
    //             format: 'pem'
    //         },
    //         privateKeyEncoding: {
    //             type: 'pkcs8',
    //             format: 'pem',
    //             cipher: 'aes-256-cbc',
    //             passphrase: ''
    //         }
    //     });
    //     fs.writeFileSync("public_key", keyPair.publicKey);
    //     fs.writeFileSync("private_Key", keyPair.privateKey);
    // }
    // const RSA_PUBLIC_KEY = fs.readFileSync("./public_key", "utf8");
    // const RSA_PRIVATE_KEY = fs.readFileSync("./private_Key", "utf8");

    // let RSAencrypt = function (privateKey, string) {
    //     return crypto.privateEncrypt({ key: privateKey, passphrase: '' }, Buffer.from(string));
    // }
    // let RSAdecrypt = function (publicKey, encryptData) {
    //     return crypto.publicDecrypt({ key: publicKey, }, encryptData);
    // }

    // let AESencrypt = function (key, iv, string) {
    //     const cipher = crypto.createCipheriv('aes-128-cbc', key, iv);
    //     return cipher.update(Buffer.from(string), undefined, "base64") + cipher.final("base64");
    // }
    // let AESdecrypt = function (key, iv, encryptData) {
    //     const decipher = crypto.createDecipheriv('aes-128-cbc', key, iv);
    //     return decipher.update(encryptData, "base64", "utf8") + decipher.final('utf8');
    // }

    // // const thisRkey  = 


    // const cipherStr = AESencrypt(AES_KEY, AES_IV, tokenText);
    // console.log("cipherStr:", cipherStr.toString());
    // const decipherStr = AESdecrypt(AES_KEY, AES_IV, cipherStr);
    // console.log(decipherStr);
    // return



})()