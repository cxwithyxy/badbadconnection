"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
class Main_app {
    constructor(channel) {
        console.log("Main_app inject successfully");
        this.channel = channel;
        this.ipc_init();
        this.send("Main_app inject successfully");
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
    }
}
global.Main_app = Main_app;
