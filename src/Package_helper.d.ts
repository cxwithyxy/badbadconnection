export declare function quick_random_md5(): string;
export declare class Data_package {
    sending_package_md5?: string;
    msg_md5?: string;
    total_length?: number;
    current_index?: number;
    package_data?: string;
}
export declare class Message_date {
    msg_md5?: string;
    data_package_list: Data_package[];
    message_content?: string;
    constructor();
    add_data_package(dp: Data_package): void;
}
export declare class Package_helper {
    message_date_list: Message_date[];
    constructor();
    /**
     * 基于数据包原始数据生成数据包对象
     *
     * @static
     * @param {string} source_str 原始数据
     * @returns {Data_package}
     * @memberof Package_helper
     */
    static parse_data_package(source_str: string): Data_package;
    static package_string_making_loop(msg: string, package_data_length: number, loopdo: (package_string: string, package_md5: string) => Promise<void>): Promise<void>;
    /**
     * 创建数据包
     *
     * @static
     * @param {string} sending_package_md5 数据包自身md5标识
     * @param {string} msg_md5 数据整体的md5标识
     * @param {number} total_length 数据整体大小
     * @param {number} current_index 当前数据包起始点
     * @param {string} package_data 数据包携带的数据
     * @returns {string}
     * @memberof Package_helper
     */
    static create_package_string(sending_package_md5: string, msg_md5: string, total_length: number, current_index: number, package_data: string): string;
    /**
     * 解析数据包
     *
     * @static
     * @param {string} source_str
     * @param {("md5" | "msgmd5" | "total" | "current" | "data")} type
     * md5: 当前数据包md5标识
     * msgmd5: 数据整体的md5标识
     * total: 总数据大小
     * current: 当前数据开始位置
     * data: 数据包所带数据
     * @returns {string}
     * @memberof Package_helper
     */
    static parse_package_string(source_str: string, type: "md5" | "msgmd5" | "total" | "current" | "data"): string;
}
