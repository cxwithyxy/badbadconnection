import aesjs from "aes-js";
const MD5 = require('md5.js')

export class Encryption_string
{

    key_string: string
    key: Uint8Array
    counter: number

    /**
     *Creates an instance of Encryption_string.
     * @param {string} key_string 秘钥字符串
     * @param {number} [counter=1] 采用CTR, 因此需要设定计数器
     * @memberof Encryption_string
     */
    constructor(key_string: string, counter: number = 1)
    {
        this.key_string = key_string
        let key_md5:string = Encryption_string.get_md5(key_string)
        this.key = aesjs.utils.utf8.toBytes(key_md5)
        this.counter = counter
    }

    /**
     * 加密字符串
     *
     * @param {string} target_str
     * @returns {string}
     * @memberof Encryption_string
     */
    encode(target_str: string): string
    {
        let textBytes = aesjs.utils.utf8.toBytes(target_str);
        let aesCtr = new aesjs.ModeOfOperation.ctr(this.key, new aesjs.Counter(this.counter));
        let encryptedBytes = aesCtr.encrypt(textBytes);
        let encryptedHex = aesjs.utils.hex.fromBytes(encryptedBytes);
        return encryptedHex
    }

    /**
     * 解密字符串
     *
     * @param {string} target_str
     * @returns {string}
     * @memberof Encryption_string
     */
    decode(target_str: string): string
    {
        let encryptedBytes = aesjs.utils.hex.toBytes(target_str);
        let aesCtr = new aesjs.ModeOfOperation.ctr(this.key, new aesjs.Counter(this.counter));
        let decryptedBytes = aesCtr.decrypt(encryptedBytes);
        let decryptedText = aesjs.utils.utf8.fromBytes(decryptedBytes);
        return decryptedText
    }

    static get_md5(source: string): string
    {
        return new MD5().update(source).digest('hex')
    }
}