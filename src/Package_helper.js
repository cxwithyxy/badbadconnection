"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const numeral_1 = __importDefault(require("numeral"));
const Encryption_string_1 = require("./../src/Encryption_string");
const lodash_1 = __importDefault(require("lodash"));
function quick_random_md5() {
    let msg_md5;
    msg_md5 = Encryption_string_1.Encryption_string.get_md5(String(Math.random()));
    return msg_md5;
}
exports.quick_random_md5 = quick_random_md5;
class Data_package {
}
exports.Data_package = Data_package;
class Message_data {
    constructor(msg_md5) {
        this.msg_md5 = msg_md5;
        this.data_package_list = [];
    }
    add_data_package(dp) {
        this.data_package_list.push(dp);
    }
}
exports.Message_data = Message_data;
class Package_helper {
    constructor() {
        this.message_data_list = [];
    }
    find_message_data_index(msg_md5) {
        let index = lodash_1.default.findIndex(this.message_data_list, message_data => {
            return message_data.msg_md5 == msg_md5;
        });
        return index;
    }
    setup_message_data(msg_md5) {
        let index = this.find_message_data_index(msg_md5);
        if (index == -1) {
            let message_data = new Message_data(msg_md5);
            this.message_data_list.push(message_data);
            return message_data;
        }
        return this.message_data_list[index];
    }
    /**
     * 基于数据包原始数据生成数据包对象
     *
     * @static
     * @param {string} source_str 原始数据
     * @returns {Data_package}
     * @memberof Package_helper
     */
    static parse_data_package(source_str) {
        let dp = new Data_package();
        dp.sending_package_md5 = Package_helper.parse_package_string(source_str, "md5");
        dp.msg_md5 = Package_helper.parse_package_string(source_str, "msgmd5");
        dp.total_length = Number(Package_helper.parse_package_string(source_str, "total"));
        dp.current_index = Number(Package_helper.parse_package_string(source_str, "current"));
        dp.package_data = Package_helper.parse_package_string(source_str, "data");
        return dp;
    }
    static async package_string_making_loop(msg, package_data_length, loopdo) {
        let msg_for_send = msg;
        let msg_md5 = quick_random_md5();
        let total_length = msg_for_send.length;
        let current_index = 0;
        for (;;) {
            let package_data = msg_for_send.substr(current_index, package_data_length);
            let package_md5 = quick_random_md5();
            // console.log(`${current_index}: ${package_data}`);
            let package_string = Package_helper.create_package_string(package_md5, msg_md5, total_length, current_index, package_data);
            await loopdo(package_string, package_md5);
            current_index += package_data_length;
            if (current_index >= total_length) {
                break;
            }
        }
    }
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
    static create_package_string(sending_package_md5, msg_md5, total_length, current_index, package_data) {
        let package_for_send = sending_package_md5 +
            msg_md5 +
            numeral_1.default(total_length).format("0000000000000") +
            numeral_1.default(current_index).format("0000000000000") +
            package_data;
        return package_for_send;
    }
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
    static parse_package_string(source_str, type) {
        let pointer_dict = {
            "md5": [0, 32],
            "msgmd5": [32, 64],
            "total": [64, 77],
            "current": [77, 90],
            "data": [90]
        };
        try {
            return source_str.substring(pointer_dict[type][0], pointer_dict[type][1]);
        }
        catch (e) {
            throw new Error(`fucntion "parse_package" get something wrong, check those argus: source_str ${source_str}, type ${type}`);
        }
    }
}
exports.Package_helper = Package_helper;
