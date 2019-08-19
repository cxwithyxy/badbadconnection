import { Badbadconnection } from "../src/Badbadconnection";
import sleep from "sleep-promise";
import { BrowserWindow, webContents, ipcMain } from "electron";
import should from "should";

describe("Badbadconnection", function ()
{
    this.timeout(10 * 60e3)
    let badbadconnection: Badbadconnection
    let channel = `test${Math.round(Math.random() * 1e6)}`
    let test_msg = `test_msg${Math.round(Math.random() * 1e6)}`
    let browser: BrowserWindow

    function test_send()
    {
        browser.webContents.executeJavaScript(`
            goeasy.publish({
                channel:"${channel}",
                message:"${test_msg}"
            })
        `)
        console.log(212);
        
    }

    beforeEach(async () =>
    {
        browser = new BrowserWindow({
            width: 400,
            height: 200
        })
        await browser.loadURL("http://www.goeasy.io/cn/demo/chat")
        badbadconnection = await new Badbadconnection(channel).init()
    })

    describe("#on_recv", async () =>
    {

        it("是否能接受到信息", async () =>
        {
            await new Promise((succ) =>
            {
                badbadconnection.on_recv((msg: string) =>
                {
                    should(msg).equal(test_msg)
                    succ()
                })
                test_send()
            })
        })
        
    })
})