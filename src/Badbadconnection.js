"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
const Encryption_string_1 = require("./Encryption_string");
const Package_helper_1 = require("./Package_helper");
class Badbadconnection {
    /**
     *Creates an instance of Badbadconnection.
     * @param {string} channel 频道名称, 反正是个字符串, 什么都可以
     * @memberof Badbadconnection
     */
    constructor(channel, encryption = false) {
        this.url = "http://www.goeasy.io/cn/demo/qrcodelogin";
        this.encryption_string = false;
        this.package_data_length = 6;
        this.sending_package_md5 = "";
        this.event_name_init();
        if (encryption) {
            let encryption2 = encryption;
            this.encryption_string = new Encryption_string_1.Encryption_string(encryption2.key, encryption2.counter);
        }
        this.channel = channel;
        this.win = new electron_1.BrowserWindow({
            width: 400,
            height: 200,
            show: false,
            webPreferences: {
                preload: `${__dirname}/src_in_browser/Main.js`,
                offscreen: true
            }
        });
        this.wincc = this.win.webContents;
        this.on_resv_func = (msg) => { };
        this.package_container = new Package_helper_1.Package_helper();
    }
    event_name_init() {
        this.c_event = {
            main_app_recv: `main_app_recv${Date.now()}${Math.random()}`,
            main_app_send: `main_app_send${Date.now()}${Math.random()}`
        };
    }
    try_encode(str) {
        if (this.encryption_string) {
            return this.encryption_string.encode(str);
        }
        return str;
    }
    try_decode(str) {
        if (this.encryption_string) {
            return this.encryption_string.decode(str);
        }
        return str;
    }
    /**
     * 初始化, 记得await它
     *
     * @returns {Promise<Badbadconnection>}
     * @memberof Badbadconnection
     */
    async init() {
        await this.win.loadURL(this.url);
        await this.wincc.executeJavaScript(`let main_app`);
        await this.wincc.executeJavaScript(`
            (async () =>{
                main_app = new Main_app(
                    "${this.try_encode(this.channel)}",
                    {
                        main_app_recv: "${this.c_event.main_app_recv}",
                        main_app_send: "${this.c_event.main_app_send}"
                    }
                );
                await main_app.ipc_init();
            })()
        `);
        electron_1.ipcMain.on(this.c_event.main_app_recv, (e, msg) => {
            let package_md5 = Package_helper_1.Package_helper.parse_package_string(msg, "md5");
            if (package_md5 == this.sending_package_md5) {
                if (this.send_finish_callback) {
                    this.send_finish_callback();
                    this.send_finish_callback = undefined;
                }
            }
            this.package_container.add_source_str_to_message_data(msg);
        });
        this.package_container.on("message_finish", (m_d) => {
            this.on_resv_func(this.try_decode(m_d.get_message_content()));
        });
        return this;
    }
    /**
     * 发送信息
     *
     * @param {string} msg
     * @memberof Badbadconnection
     */
    async send(msg) {
        let msg_for_send = this.try_encode(msg);
        await Package_helper_1.Package_helper.package_string_making_loop(msg_for_send, 13, async (package_string, package_md5) => {
            await this.send_package(package_md5, package_string);
        });
    }
    async send_package(package_md5, package_data) {
        return new Promise(succ => {
            this.send_finish_callback = succ;
            this.sending_package_md5 = package_md5;
            this.wincc.send(this.c_event.main_app_send, package_data);
        });
    }
    /**
     * 设置接受消息的回调函数
     *
     * @param {(msg: string) => void} _func
     * @memberof Badbadconnection
     */
    on_recv(_func) {
        this.on_resv_func = _func;
    }
    async close() {
        await this.wincc.executeJavaScript(`main_app.close()`);
        this.win.close();
    }
}
exports.Badbadconnection = Badbadconnection;
