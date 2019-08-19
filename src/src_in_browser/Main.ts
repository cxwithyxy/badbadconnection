import { ipcRenderer } from "electron";

class Main_app
{
    channel: string

    constructor(channel: string)
    {
        console.log("Main_app inject successfully")
        this.channel = channel
        this.ipc_init()
        this.send("Main_app inject successfully")
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
        ipcRenderer.on("main_app_send", (e, msg) =>
        {
            this.send(msg)
        })
    }
}

(<any>global).Main_app = Main_app
