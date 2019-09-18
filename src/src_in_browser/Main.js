"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
class Main_app {
    constructor(channel, c_event) {
        this.channel = channel;
        this.c_event = c_event;
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
    async ipc_init() {
        return new Promise((succ, fail) => {
            electron_1.ipcRenderer.on(this.c_event.main_app_send, (e, msg) => {
                this.send(msg);
            });
            this.get_goeasy().subscribe({
                channel: this.channel,
                onMessage: (message) => {
                    electron_1.ipcRenderer.send(this.c_event.main_app_recv, message.content);
                },
                onSuccess: function () {
                    succ();
                },
                onFailed: function (error) {
                    fail(error.content);
                }
            });
        });
    }
}
global.Main_app = Main_app;
