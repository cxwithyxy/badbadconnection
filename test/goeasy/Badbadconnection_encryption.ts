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
        await browser.loadURL("http://www.goeasy.io/cn/demo/chat")
        badbadconnection_1 = await new Badbadconnection(channel, {key: key, counter:counter}).init()
        badbadconnection_2 = await new Badbadconnection(channel, {key: key, counter:counter}).init()
    })

    describe("#send and #on_recv", async () =>
    {
        it("是否能以加密的方式通讯", async () =>
        {
            await new Promise(async (succ) =>
            {
                badbadconnection_1.on_recv(async (msg: string) =>
                {
                    should(msg).equal(test_msg)
                    let test_recv:string = await browser.webContents.executeJavaScript(`test_recv`)
                    should(test_recv).not.equal("test")
                    should(test_recv).not.equal(msg)
                    succ()
                })
                await browser.webContents.executeJavaScript(`
                    test_recv = "test"
                    goeasy.subscribe({
                        channel:'${badbadconnection_1.try_encode(channel)}',
                        onMessage: function(message)
                        {
                            test_recv = message.content
                        }
                    });
                `)
                badbadconnection_2.send(test_msg)
                
            })
        })
    })
})