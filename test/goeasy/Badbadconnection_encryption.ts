import { Badbadconnection } from "../../index";
import sleep from "sleep-promise";
import { BrowserWindow} from "electron";
import should from "should";

describe("Badbadconnection encryption", function ()
{
    this.timeout(10 * 60e3)
    let badbadconnection_1: Badbadconnection
    let badbadconnection_2: Badbadconnection
    let channel = `test${Math.round(Math.random() * 1e6)}`
    let test_msg = `test_msg${Math.round(Math.random() * 1e6)}`
    let key = `key_${Math.round(Math.random() * 1e9)}`
    let counter = Math.round(Math.random() * 50)
    let browser: BrowserWindow

    beforeEach(async () =>
    {
        browser = new BrowserWindow({
            width: 400,
            height: 200
        })
        await browser.loadURL("https://www.goeasy.io/cn/demos/demos.html")
        browser.webContents.executeJavaScript(`loadDemo('scanLogin')`)
        await new Promise(succ2 => 
        {
            let t_out = setInterval(() =>
            {
                try
                {
                    browser.webContents.executeJavaScript("goeasy")
                    clearInterval(t_out)
                    succ2()
                }
                catch(e){}
            }, 1e3)
        })
        badbadconnection_1 = await new Badbadconnection(channel, {key: key, counter:counter}).init()
        badbadconnection_2 = await new Badbadconnection(channel, {key: key, counter:counter}).init()
    })

    describe("#send and #on_recv", async () =>
    {
        it("是否能以加密的方式通讯", async () =>
        {
            let b1_resv = ""
            let promise1 = new Promise((succ1) =>
            {
                badbadconnection_1.on_recv(async (msg: string) =>
                {
                    b1_resv = msg
                    succ1()
                })
            })
            let promise2 =  browser.webContents.executeJavaScript(`
                test_recv = "test";
                new Promise((succ) =>
                {
                    goeasy.subscribe({
                        channel:'${badbadconnection_1.try_encode(channel)}',
                        onMessage: function(message)
                        {
                            test_recv = message.content
                            succ()
                        }
                    });
                });
            `)
            await sleep(3e3)
            badbadconnection_2.send(test_msg)
             
            await Promise.all([promise1, promise2])
            should(b1_resv).equal(test_msg)
            let test_recv:string = await browser.webContents.executeJavaScript(`test_recv`)
            should(test_recv).not.equal("test")
            should(test_recv).not.equal(b1_resv)
        })
    })
})