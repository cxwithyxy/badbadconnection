import { ipcRenderer } from "electron";
import { connection_event } from "../../connection_event";

class Main_app
{
    channel: string
    c_event: connection_event

    constructor(channel: string, c_event: connection_event)
    {
        this.channel = channel
        this.c_event = c_event
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

    async ipc_init()
    {
        return new Promise((succ, fail) =>
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
                },
                onSuccess: function () {
                    succ()
                },
                onFailed: function (error: {code:string, content: string}) {
                    fail(error.content)
                }
            });
        })
    }

    async close()
    {
        return new Promise((succ, fail) =>
        {
            this.get_goeasy().unsubscribe({
                channel: this.channel,
                onSuccess: function () {
                    succ()
                },
                onFailed: function (error: {code:string, content: string}) {
                    fail(error.content)
                }
            });
        })
    }
}

(<any>global).Main_app = Main_app
