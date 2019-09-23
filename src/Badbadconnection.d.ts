import { BrowserWindow, webContents } from "electron";
import { Encryption_string } from "./Encryption_string";
import { connection_event } from "./connection_event";
export declare class Badbadconnection {
    url: string;
    win: BrowserWindow;
    wincc: webContents;
    on_resv_func: (msg: string) => void;
    channel: string;
    encryption_string: Encryption_string | boolean;
    c_event: connection_event;
    sending_msg_md5: string;
    /**
     *Creates an instance of Badbadconnection.
     * @param {string} channel 频道名称, 反正是个字符串, 什么都可以
     * @memberof Badbadconnection
     */
    constructor(channel: string, encryption?: {
        key: string;
        counter: number;
    } | boolean);
    event_name_init(): void;
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
    /**
     * 解析数据包
     * 0-32: md5
     * 32-45: 总大小
     * 45-58: 当前位置
     * 58-71: 结束位置
     * 71-end: 数据
     * @param {string} source_str
     * @param {("md5" | "total" | "start" | "end" | "data")} type
     * @returns {string}
     * @memberof Badbadconnection
     */
    get_data(source_str: string, type: "md5" | "total" | "start" | "end" | "data"): string;
    build_sending_msg_md5(): string;
    close(): Promise<void>;
}
