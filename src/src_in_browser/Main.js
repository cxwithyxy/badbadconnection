"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
class Main_app {
    constructor(channel) {
        this.channel = channel;
        this.ipc_init();
    }
    get_goeasy() {
        return eval("goeasy");
    }
    send(msg) {
        this.get_goeasy().publish({
            channel: this.channel,
            message: msg
        });
    }
    ipc_init() {
        electron_1.ipcRenderer.on("main_app_send", (e, msg) => {
            this.send(msg);
        });
        this.get_goeasy().subscribe({
            channel: this.channel,
            onMessage: (message) => {
                console.log('收到：' + message.content);
                electron_1.ipcRenderer.send("main_app_recv", message.content);
            }
        });
    }
}
global.Main_app = Main_app;
