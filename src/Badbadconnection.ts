import { BrowserWindow, webContents, ipcMain, IpcMainEvent } from "electron";
import { Encryption_string } from "./Encryption_string";

export class Badbadconnection
{

    url = "http://www.goeasy.io/cn/demo/qrcodelogin"
    win: BrowserWindow
    wincc: webContents
    on_resv_func: (msg: string) => void
    channel: string
    encryption_string: Encryption_string | boolean = false


    /**
     *Creates an instance of Badbadconnection.
     * @param {string} channel 频道名称, 反正是个字符串, 什么都可以
     * @memberof Badbadconnection
     */
    constructor(channel: string, encryption: {key: string, counter: number} | boolean = false)
    {
        if(encryption)
        {
            let encryption2 = (<{key: string, counter: number}>encryption)
            this.encryption_string = new Encryption_string(encryption2.key, encryption2.counter)
        }
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

    try_encode(str: string): string
    {
        if(this.encryption_string)
        {
            return (<Encryption_string>this.encryption_string).encode(str)
        }
        return str
    }

    try_decode(str: string): string
    {
        if(this.encryption_string)
        {
            return (<Encryption_string>this.encryption_string).decode(str)
        }
        return str
    }

    /**
     * 初始化, 记得await它
     *
     * @returns {Promise<Badbadconnection>}
     * @memberof Badbadconnection
     */
    async init(): Promise<Badbadconnection>
    {
        await this.win.loadURL(this.url)

        await this.wincc.executeJavaScript(`let main_app = new Main_app("${this.try_encode(this.channel)}")`)

        ipcMain.on("main_app_recv", (e: IpcMainEvent, msg: string) =>
        {
            this.on_resv_func(this.try_decode(msg))
        })

        return this
    }


    /**
     * 发送信息
     *
     * @param {string} msg
     * @memberof Badbadconnection
     */
    send(msg: string)
    {
        this.wincc.send("main_app_send", this.try_encode(msg))
    }


    /**
     * 设置接受消息的回调函数
     *
     * @param {(msg: string) => void} _func
     * @memberof Badbadconnection
     */
    on_recv(_func: (msg: string) => void)
    {
        this.on_resv_func = _func
    }

}