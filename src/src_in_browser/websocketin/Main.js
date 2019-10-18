"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
class Main_app {
    constructor(channel, c_event) {
        this.channel = channel;
        this.c_event = c_event;
    }
    send(msg) {
        this.ws.send(msg);
        electron_1.ipcRenderer.send(this.c_event.main_app_recv, msg); // 这里要模拟goeasy中发送方依旧收到自己的信息的情形, 不然要改很多逻辑了
    }
    async ipc_init() {
        return new Promise((succ, fail) => {
            let wsurl = `wss://connect.websocket.in/badbadconnection?room_id=${this.channel}`;
            this.ws = new WebSocket(wsurl);
            this.ws.addEventListener("open", () => {
                succ();
            });
            this.ws.addEventListener("message", (event) => {
                electron_1.ipcRenderer.send(this.c_event.main_app_recv, event.data);
            });
            electron_1.ipcRenderer.on(this.c_event.main_app_send, (e, msg) => {
                this.send(msg);
            });
        });
    }
    async close() {
        return new Promise((succ, fail) => {
            this.ws.addEventListener("close", () => {
                succ();
            });
            this.ws.close();
        });
    }
}
global.Main_app = Main_app;
