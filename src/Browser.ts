import { BrowserWindow, webContents } from "electron";

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
                nodeIntegration: true
            }
        })
        this.wincc = this.win.webContents
    }

    async init()
    {
        await this.win.loadURL(this.url)

        await this.wincc.executeJavaScript(`let {ipcRenderer} = require("electron")`)

        return this
    }



}