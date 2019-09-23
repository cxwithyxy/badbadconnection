import { BrowserWindow, webContents, ipcMain, IpcMainEvent } from "electron";
import { Encryption_string } from "./Encryption_string";
import { connection_event } from "./connection_event";

export class Badbadconnection
{

    url = "http://www.goeasy.io/cn/demo/qrcodelogin"
    win: BrowserWindow
    wincc: webContents
    on_resv_func: (msg: string) => void
    channel: string
    encryption_string: Encryption_string | boolean = false
    c_event!: connection_event
    sending_msg_md5!: string
    send_finish_callback?: () => void


    /**
     *Creates an instance of Badbadconnection.
     * @param {string} channel 频道名称, 反正是个字符串, 什么都可以
     * @memberof Badbadconnection
     */
    constructor(channel: string, encryption: {key: string, counter: number} | boolean = false)
    {
        this.sending_msg_md5 = ""
        this.event_name_init()
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

    event_name_init()
    {
        this.c_event = {
            main_app_recv: `main_app_recv${Date.now()}${Math.random()}`,
            main_app_send: `main_app_send${Date.now()}${Math.random()}`
        }
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
        await this.wincc.executeJavaScript(`let main_app`)
        await this.wincc.executeJavaScript(`
            (async () =>{
                main_app = new Main_app(
                    "${this.try_encode(this.channel)}",
                    {
                        main_app_recv: "${this.c_event.main_app_recv}",
                        main_app_send: "${this.c_event.main_app_send}"
                    }
                );
                await main_app.ipc_init();
            })()
        `)

        ipcMain.on(this.c_event.main_app_recv, (e: IpcMainEvent, msg: string) =>
        {
            let msg_md5 = this.get_data(msg, "md5")
            if(msg_md5 == this.sending_msg_md5)
            {
                if(this.send_finish_callback)
                {
                    this.send_finish_callback()
                    this.send_finish_callback = undefined
                }
            }
            else
            {
                let recv_msg = this.get_data(msg, "data")
                let decode_msg = this.try_decode(recv_msg)
                this.on_resv_func(decode_msg)
            }
        })
        return this
    }


    /**
     * 发送信息
     *
     * @param {string} msg
     * @memberof Badbadconnection
     */
    async send(msg: string)
    {
        return new Promise(succ =>
        {
            this.send_finish_callback = succ
            this.sending_msg_md5 = this.build_sending_msg_md5()
            msg = this.sending_msg_md5 + this.try_encode(msg)
            this.wincc.send(this.c_event.main_app_send, msg)
        })
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

    /**
     * 解析数据包
     * 0-32: md5
     * 32-45: 总大小
     * 45-58: 当前位置
     * 58-71: 结束位置
     * 71-end: 数据
     * @param {string} source_str
     * @param {("md5" | "total" | "start" | "end" | "data")} type
     * @returns {string}
     * @memberof Badbadconnection
     */
    get_data(source_str: string, type: "md5" | "total" | "start" | "end" | "data"): string
    {
        let low_type = type.toLowerCase()
        if(low_type == "md5")
        {
            return source_str.substring(0, 32)
        }
        if(low_type == "data")
        {
            return source_str.substring(32)
        }
        throw new Error(`fucntion "get_data" get something wrong, check those argus: source_str ${source_str}, type ${type}`);
    }

    build_sending_msg_md5(): string
    {
        let msg_md5: string
        msg_md5 = Encryption_string.get_md5(String(Math.random()))
        return msg_md5
    }

    async close()
    {
        await this.wincc.executeJavaScript(`main_app.close()`)
        this.win.close()
    }

}
