import { BrowserWindow, webContents, ipcMain } from "electron";

export class Badbadconnection
{

    url = "http://www.goeasy.io/cn/demo/qrcodelogin"
    win: BrowserWindow
    wincc: webContents
    on_resv_func: (msg: string) => void
    channel: string

    constructor(channel: string)
    {
        this.channel = channel
        this.win = new BrowserWindow({
            width: 400,
            height: 200,
            show: false,
            webPreferences: {
                preload: `${__dirname}/src_in_browser/Main.js`,
                offscreen: true
            }
        })
        this.wincc = this.win.webContents
        this.on_resv_func = (msg: string) => {}
    }

    async init()
    {
        await this.win.loadURL(this.url)

        await this.wincc.executeJavaScript(`let main_app = new Main_app("${this.channel}")`)

        ipcMain.on("main_app_recv", (e, msg) =>
        {
            this.on_resv_func(msg);
        })

        return this
    }

    send(msg: string)
    {
        this.wincc.send("main_app_send", msg)
    }

    on_recv(_func: (msg: string) => void)
    {
        this.on_resv_func = _func
    }

}