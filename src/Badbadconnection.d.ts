import { BrowserWindow, webContents } from "electron";
import { Encryption_string } from "./Encryption_string";
export declare class Badbadconnection {
    url: string;
    win: BrowserWindow;
    wincc: webContents;
    on_resv_func: (msg: string) => void;
    channel: string;
    encryption_string: Encryption_string | boolean;
    /**
     *Creates an instance of Badbadconnection.
     * @param {string} channel 频道名称, 反正是个字符串, 什么都可以
     * @memberof Badbadconnection
     */
    constructor(channel: string, encryption?: {
        key: string;
        counter: number;
    } | boolean);
    try_encode(str: string): string;
    try_decode(str: string): string;
    /**
     * 初始化, 记得await它
     *
     * @returns {Promise<Badbadconnection>}
     * @memberof Badbadconnection
     */
    init(): Promise<Badbadconnection>;
    /**
     * 发送信息
     *
     * @param {string} msg
     * @memberof Badbadconnection
     */
    send(msg: string): void;
    /**
     * 设置接受消息的回调函数
     *
     * @param {(msg: string) => void} _func
     * @memberof Badbadconnection
     */
    on_recv(_func: (msg: string) => void): void;
}
