"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const aes_js_1 = __importDefault(require("aes-js"));
const MD5 = require('md5.js');
class Encryption_string {
    /**
     *Creates an instance of Encryption_string.
     * @param {string} key_string 秘钥字符串
     * @param {number} [counter=1] 采用CTR, 因此需要设定计数器
     * @memberof Encryption_string
     */
    constructor(key_string, counter = 1) {
        this.key_string = key_string;
        let key_md5 = Encryption_string.get_md5(key_string);
        this.key = aes_js_1.default.utils.utf8.toBytes(key_md5);
        this.counter = counter;
    }
    /**
     * 加密字符串
     *
     * @param {string} target_str
     * @returns {string}
     * @memberof Encryption_string
     */
    encode(target_str) {
        let textBytes = aes_js_1.default.utils.utf8.toBytes(target_str);
        let aesCtr = new aes_js_1.default.ModeOfOperation.ctr(this.key, new aes_js_1.default.Counter(this.counter));
        let encryptedBytes = aesCtr.encrypt(textBytes);
        let encryptedHex = aes_js_1.default.utils.hex.fromBytes(encryptedBytes);
        return encryptedHex;
    }
    /**
     * 解密字符串
     *
     * @param {string} target_str
     * @returns {string}
     * @memberof Encryption_string
     */
    decode(target_str) {
        let encryptedBytes = aes_js_1.default.utils.hex.toBytes(target_str);
        let aesCtr = new aes_js_1.default.ModeOfOperation.ctr(this.key, new aes_js_1.default.Counter(this.counter));
        let decryptedBytes = aesCtr.decrypt(encryptedBytes);
        let decryptedText = aes_js_1.default.utils.utf8.fromBytes(decryptedBytes);
        return decryptedText;
    }
    static get_md5(source) {
        return new MD5().update(source).digest('hex');
    }
}
exports.Encryption_string = Encryption_string;
