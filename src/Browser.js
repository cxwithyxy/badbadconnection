"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
class Browser {
    constructor() {
        this.url = "http://www.goeasy.io/cn/demo/qrcodelogin";
        this.win = new electron_1.BrowserWindow({
            width: 400,
            height: 200,
            webPreferences: {
                nodeIntegration: true
            }
        });
    }
    async init() {
        await this.win.loadURL(this.url);
        return this;
    }
}
exports.Browser = Browser;
