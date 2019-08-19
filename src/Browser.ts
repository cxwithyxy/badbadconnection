import { BrowserWindow, webContents, ipcMain } from "electron";

export class Browser
{

    url = "http://www.goeasy.io/cn/demo/qrcodelogin"
    win: BrowserWindow
    wincc: webContents

    constructor()
    {
        this.win = new BrowserWindow({
            width: 400,
            height: 200,
            webPreferences: {
                preload: `${__dirname}/src_in_browser/Main.js`
            }
        })
        this.wincc = this.win.webContents
    }

    async init()
    {
        await this.win.loadURL(this.url)

        await this.wincc.executeJavaScript(`let main_app = new Main_app("demo_channel2")`)

        ipcMain.on("main_app_recv", (e, msg) =>
        {
            console.log(msg);
            
        })

        this.wincc.send("main_app_send", "do do do do do")

        return this
    }



}