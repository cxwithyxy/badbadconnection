"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
class Badbadconnection {
    /**
     *Creates an instance of Badbadconnection.
     * @param {string} channel 频道名称, 反正是个字符串, 什么都可以
     * @memberof Badbadconnection
     */
    constructor(channel) {
        this.url = "http://www.goeasy.io/cn/demo/qrcodelogin";
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
    }
    /**
     * 初始化, 记得await它
     *
     * @returns {Promise<Badbadconnection>}
     * @memberof Badbadconnection
     */
    async init() {
        await this.win.loadURL(this.url);
        await this.wincc.executeJavaScript(`let main_app = new Main_app("${this.channel}")`);
        electron_1.ipcMain.on("main_app_recv", (e, msg) => {
            this.on_resv_func(msg);
        });
        return this;
    }
    /**
     * 发送信息
     *
     * @param {string} msg
     * @memberof Badbadconnection
     */
    send(msg) {
        this.wincc.send("main_app_send", msg);
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
}
exports.Badbadconnection = Badbadconnection;
