const fs = require('fs');
const path = require('path');
const TOKEN_PRIVATE_KEY: string = fs.readFileSync(path.join(__dirname, "./private_Key"), 'utf-8');
// const TOKEN_PRIVATE_KEY:string = fs.readFileSync("./private_Key", 'utf-8');
const TOKEN_PUBLIC_KEY: string = fs.readFileSync(path.join(__dirname, "./public_key"), 'utf-8');
// const TOKEN_PUBLIC_KEY:string = fs.readFileSync("./public_key", 'utf-8');

const TOKEN_EXPIRE_DAYS: number = 14

export {
    TOKEN_PRIVATE_KEY,
    TOKEN_PUBLIC_KEY,
    TOKEN_EXPIRE_DAYS,
}