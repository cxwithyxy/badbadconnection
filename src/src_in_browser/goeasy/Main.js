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
        return new Promise(async (succ, fail) => {
            electron_1.ipcRenderer.on(this.c_event.main_app_send, (e, msg) => {
                this.send(msg);
            });
            eval("loadDemo('scanLogin')");
            await new Promise(succ2 => {
                let t_out = setInterval(() => {
                    try {
                        this.get_goeasy();
                        clearInterval(t_out);
                        succ2();
                    }
                    catch (e) { }
                }, 1e3);
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
    async close() {
        return new Promise((succ, fail) => {
            this.get_goeasy().unsubscribe({
                channel: this.channel,
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
