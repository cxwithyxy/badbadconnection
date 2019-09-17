import { ipcRenderer } from "electron";
import { connection_event } from "./../connection_event";

class Main_app
{
    channel: string
    c_event: connection_event

    constructor(channel: string, c_event: connection_event)
    {
        this.channel = channel
        this.c_event = c_event
        this.ipc_init()
    }

    get_goeasy(): any
    {
        return eval("goeasy")
    }

    send(msg: string)
    {
        this.get_goeasy().publish({
            channel: this.channel,
            message: msg
        })
    }

    ipc_init()
    {
        ipcRenderer.on(this.c_event.main_app_send, (e, msg) =>
        {
            this.send(msg)
        })

        this.get_goeasy().subscribe({
            channel: this.channel,
            onMessage: (message:{content:string}) =>
            {
                ipcRenderer.send(this.c_event.main_app_recv, message.content)
            }
        });
    }
}

(<any>global).Main_app = Main_app
