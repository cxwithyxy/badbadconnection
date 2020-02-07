"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const numeral_1 = __importDefault(require("numeral"));
const Encryption_string_1 = require("./../src/Encryption_string");
const lodash_1 = __importDefault(require("lodash"));
const util_1 = require("util");
const events_1 = require("events");
class DATA_PACKAGE_AREADY_EXISTS extends Error {
}
exports.DATA_PACKAGE_AREADY_EXISTS = DATA_PACKAGE_AREADY_EXISTS;
class DATA_PACKAGE_NOT_FOUND_IN_MESSAGE_DATA extends Error {
}
exports.DATA_PACKAGE_NOT_FOUND_IN_MESSAGE_DATA = DATA_PACKAGE_NOT_FOUND_IN_MESSAGE_DATA;
class ARGUMENTS_MISS extends Error {
}
exports.ARGUMENTS_MISS = ARGUMENTS_MISS;
function quick_random_md5() {
    let msg_md5;
    msg_md5 = Encryption_string_1.Encryption_string.get_md5(String(Math.random()));
    return msg_md5;
}
exports.quick_random_md5 = quick_random_md5;
class Data_package {
    is_endding_package() {
        return (this.current_index + this.package_data.length) >= this.total_length;
    }
}
exports.Data_package = Data_package;
class Message_data {
    constructor(msg_md5) {
        this.msg_md5 = msg_md5;
        this.data_package_list = [];
    }
    clean_up() {
        delete this.message_content;
    }
    get_message_content() {
        let current_index = 0;
        let message_content = "";
        let temp_data_package;
        if (!util_1.isUndefined(this.message_content)) {
            return this.message_content;
        }
        for (;;) {
            try {
                temp_data_package = this.find_data_package({ current_index: current_index });
                message_content += temp_data_package.package_data;
            }
            catch (e) {
                if (e instanceof DATA_PACKAGE_NOT_FOUND_IN_MESSAGE_DATA) {
                    this.message_content = message_content;
                    return message_content;
                }
                throw e;
            }
            current_index = message_content.length;
        }
    }
    find_data_package(filter) {
        let index = lodash_1.default.findIndex(this.data_package_list, data_package => {
            if (!util_1.isUndefined(filter.sending_package_md5) && !util_1.isUndefined(filter.current_index)) {
                return data_package.sending_package_md5 == filter.sending_package_md5 && data_package.current_index == filter.current_index;
            }
            else if (!util_1.isUndefined(filter.sending_package_md5)) {
                return data_package.sending_package_md5 == filter.sending_package_md5;
            }
            else if (!util_1.isUndefined(filter.current_index)) {
                return data_package.current_index == filter.current_index;
            }
            else {
                throw new ARGUMENTS_MISS(`filter: ${filter}`);
            }
        });
        if (index == -1) {
            throw new DATA_PACKAGE_NOT_FOUND_IN_MESSAGE_DATA();
        }
        return this.data_package_list[index];
    }
    find_data_package_index(package_md5) {
        let index = lodash_1.default.findIndex(this.data_package_list, data_package => {
            return data_package.sending_package_md5 == package_md5;
        });
        return index;
    }
    add_data_package(dp) {
        let index = this.find_data_package_index(dp.sending_package_md5);
        if (index != -1) {
            throw new DATA_PACKAGE_AREADY_EXISTS(`package_md5: ${dp.sending_package_md5}`);
        }
        this.data_package_list.push(dp);
    }
}
exports.Message_data = Message_data;
class Package_helper extends events_1.EventEmitter {
    constructor() {
        super();
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
    add_source_str_to_message_data(source_str) {
        let data_package = Package_helper.parse_data_package(source_str);
        let message_data = this.setup_message_data(data_package.msg_md5);
        message_data.add_data_package(data_package);
        if (data_package.is_endding_package()) {
            this.emit("message_finish", message_data);
        }
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