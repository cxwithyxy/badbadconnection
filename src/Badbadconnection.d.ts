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
    sending_package_md5: string;
    send_finish_callback?: () => void;
    package_data_length: number;
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
    send(msg: string): Promise<void>;
    send_package(msg_md5: string, total_length: number, current_index: number, package_data: string): Promise<unknown>;
    /**
     * 设置接受消息的回调函数
     *
     * @param {(msg: string) => void} _func
     * @memberof Badbadconnection
     */
    on_recv(_func: (msg: string) => void): void;
    /**
     * 解析数据包
     * 32: md5
     * 64: 信息识别码
     * 77: 总大小
     * 90: 当前位置
     * end: 数据
     * @param {string} source_str
     * @param {("md5" | "total" | "start" | "end" | "data")} type
     * @returns {string}
     * @memberof Badbadconnection
     */
    get_package_data(source_str: string, type: "md5" | "total" | "start" | "end" | "data"): string;
    build_random_md5(): string;
    close(): Promise<void>;
}
