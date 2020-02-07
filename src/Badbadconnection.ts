import { BrowserWindow, webContents, ipcMain, IpcMainEvent } from "electron";
import { Encryption_string } from "./Encryption_string";
import { connection_event } from "./connection_event";
import { Package_helper, Message_data } from "./Package_helper";

export class Badbadconnection
{
    connection_setting = [
        {
            url: "https://www.goeasy.io/cn/demos/demos.html",
            script: `${__dirname}/src_in_browser/goeasy/Main.js`
        },
        {
            url: `${__dirname}/src_in_browser/websocketin/index.html`,
            script: `${__dirname}/src_in_browser/websocketin/Main.js`
        }
    ]
    current_connection_setting = 0
    win!: BrowserWindow
    wincc!: webContents
    on_resv_func: (msg: string) => void
    channel: string
    encryption_string: Encryption_string | boolean = false
    c_event!: connection_event
    sending_package_md5!: string
    send_finish_callback?: () => void
    package_data_length = 1300
    package_container: Package_helper

    /**
     *Creates an instance of Badbadconnection.
     * @param {string} channel 频道名称, 反正是个字符串, 什么都可以
     * @memberof Badbadconnection
     */
    constructor(channel: string, encryption: {key: string, counter: number} | boolean = false)
    {
        this.sending_package_md5 = ""
        this.event_name_init()
        if(encryption)
        {
            let encryption2 = (<{key: string, counter: number}>encryption)
            this.encryption_string = new Encryption_string(encryption2.key, encryption2.counter)
        }
        this.channel = channel
        this.on_resv_func = (msg: string) => {}
        this.package_container = new Package_helper()
    }

    select_connection(index: number)
    {
        if(index < 0 || index >= this.connection_setting.length)
        {
            throw Error(`connection not found ! max conection index is ${this.connection_setting.length - 1}`)
        }
        this.current_connection_setting = index
        return this
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
        let connection_setting = this.connection_setting[this.current_connection_setting]
        this.win = new BrowserWindow({
            width: 400,
            height: 200,
            show: false,
            webPreferences: {
                preload: connection_setting.script,
                offscreen: true
            }
        })
        this.wincc = this.win.webContents
        await this.win.loadURL(connection_setting.url)
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
            let package_md5 = Package_helper.parse_package_string(msg, "md5")
            if(package_md5 == this.sending_package_md5)
            {
                if(this.send_finish_callback)
                {
                    this.send_finish_callback()
                    this.send_finish_callback = undefined
                }
            }
            else
            {
                this.package_container.add_source_str_to_message_data(msg)
            }
        })

        this.package_container.on("message_finish", (m_d: Message_data) =>
        {
            this.on_resv_func(this.try_decode(m_d.get_message_content()))
        })

        return this
    }


    /**
     * 发送信息
     *
     * @param {string} msg
     * @memberof Badbadconnection
     */

    async send(msg:string)
    {
        let msg_for_send = this.try_encode(msg)
        await Package_helper.package_string_making_loop(msg_for_send, this.package_data_length, async (package_string:string , package_md5: string) =>
        {
            await this.send_package(package_md5, package_string)
        })
    }

    async send_package(package_md5: string, package_data: string )
    {
        return new Promise(succ =>
        {
            this.send_finish_callback = succ
            this.sending_package_md5 = package_md5
            this.wincc.send(this.c_event.main_app_send, package_data)
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

    async close()
    {
        await this.wincc.executeJavaScript(`main_app.close()`)
        this.win.close()
    }

}
