"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
class Badbadconnection {
    constructor(channel) {
        this.url = "http://www.goeasy.io/cn/demo/qrcodelogin";
        this.channel = channel;
        this.win = new electron_1.BrowserWindow({
            width: 400,
            height: 200,
            webPreferences: {
                preload: `${__dirname}/src_in_browser/Main.js`
            }
        });
        this.wincc = this.win.webContents;
        this.on_resv_func = (msg) => { };
    }
    async init() {
        await this.win.loadURL(this.url);
        await this.wincc.executeJavaScript(`let main_app = new Main_app("${this.channel}")`);
        electron_1.ipcMain.on("main_app_recv", (e, msg) => {
            this.on_resv_func(msg);
        });
        return this;
    }
    send(msg) {
        this.wincc.send("main_app_send", msg);
    }
    on_recv(_func) {
        this.on_resv_func = _func;
    }
}
exports.Badbadconnection = Badbadconnection;
