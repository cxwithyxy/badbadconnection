import { BrowserWindow, webContents, ipcMain, IpcMainEvent } from "electron";
import { Encryption_string } from "./Encryption_string";
import { connection_event } from "./connection_event";
import { Package_helper } from "./Package_helper";

export class Badbadconnection
{

    url = "http://www.goeasy.io/cn/demo/qrcodelogin"
    win: BrowserWindow
    wincc: webContents
    on_resv_func: (msg: string) => void
    channel: string
    encryption_string: Encryption_string | boolean = false
    c_event!: connection_event
    sending_package_md5!: string
    send_finish_callback?: () => void
    package_data_length = 6


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
            let package_md5 = Package_helper.parse_package(msg, "md5")
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
                let recv_msg = Package_helper.parse_package(msg, "data")
                let decode_msg = this.try_decode(recv_msg)
                console.log(Package_helper.parse_package(msg, "msgmd5"))
                console.log(Package_helper.parse_package(msg, "total"))
                console.log(Package_helper.parse_package(msg, "current"))
                console.log(recv_msg)
                // this.on_resv_func(decode_msg)
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

    async send(msg:string)
    {
        let msg_for_send = this.try_encode(msg)
        let msg_md5 = this.build_random_md5()
        let total_length = msg_for_send.length
        let current_index = 0
        for(;;)
        {
            let package_data = msg_for_send.substr(current_index, this.package_data_length)
            console.log(`${current_index}: ${package_data}`);
            await this.send_package(msg_md5, total_length, current_index, package_data)
            current_index += this.package_data_length
            if(current_index >= total_length)
            {
                break
            }
            
        }
    }

    async send_package(msg_md5: string, total_length: number, current_index: number, package_data: string )
    {
        return new Promise(succ =>
        {
            this.send_finish_callback = succ
            this.sending_package_md5 = this.build_random_md5()
            let package_for_send = Package_helper.create_package(this.sending_package_md5, msg_md5, total_length, current_index, package_data)
            this.wincc.send(this.c_event.main_app_send, package_for_send)
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

    build_random_md5(): string
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
