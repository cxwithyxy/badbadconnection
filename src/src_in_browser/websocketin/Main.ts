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
