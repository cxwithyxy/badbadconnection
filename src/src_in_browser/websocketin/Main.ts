import { ipcRenderer } from "electron";
import { connection_event } from "../../connection_event";

class Main_app
{
    channel: string
    c_event: connection_event
    ws!: WebSocket

    constructor(channel: string, c_event: connection_event)
    {
        this.channel = channel
        this.c_event = c_event
        
    }

    send(msg: string)
    {
        this.ws.send(msg)
        ipcRenderer.send(this.c_event.main_app_recv, msg) // 这里要模拟goeasy中发送方依旧收到自己的信息的情形, 不然要改很多逻辑了
    }

    async ipc_init()
    {
        return new Promise((succ, fail) =>
        {
            this.ws = new WebSocket(`wss://connect.websocket.in/badbadconnection?room_id=${this.channel}`)
            this.ws.addEventListener("open", () => 
            {
                succ()
            })
            this.ws.addEventListener("message", (event: MessageEvent) =>
            {
                ipcRenderer.send(this.c_event.main_app_recv, event.data)
            })
            ipcRenderer.on(this.c_event.main_app_send, (e, msg) =>
            {
                this.send(msg)
            })
        })
    }

    async close()
    {
        return new Promise((succ, fail) =>
        {
            this.ws.addEventListener("close", () =>
            {
                succ()
            })
            this.ws.close()
        })
    }
}

(<any>global).Main_app = Main_app
