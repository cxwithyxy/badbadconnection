export declare class Encryption_string {
    key_string: string;
    key: Uint8Array;
    counter: number;
    /**
     *Creates an instance of Encryption_string.
     * @param {string} key_string 秘钥字符串
     * @param {number} [counter=1] 采用CTR, 因此需要设定计数器
     * @memberof Encryption_string
     */
    constructor(key_string: string, counter?: number);
    /**
     * 加密字符串
     *
     * @param {string} target_str
     * @returns {string}
     * @memberof Encryption_string
     */
    encode(target_str: string): string;
    /**
     * 解密字符串
     *
     * @param {string} target_str
     * @returns {string}
     * @memberof Encryption_string
     */
    decode(target_str: string): string;
}
