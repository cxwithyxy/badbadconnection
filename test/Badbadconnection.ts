import { Badbadconnection } from "../index";
import sleep from "sleep-promise";
import { BrowserWindow} from "electron";
import should from "should";

describe("Badbadconnection", function ()
{
    this.timeout(10 * 60e3)
    let badbadconnection: Badbadconnection
    let channel = `test${Math.round(Math.random() * 1e6)}`
    let test_msg = `test_msg${Math.round(Math.random() * 1e6)}`
    let browser: BrowserWindow

    async function test_send()
    {
        await browser.webContents.executeJavaScript(`
            goeasy.publish({
                channel:"${channel}",
                message:"${test_msg}"
            })
        `)
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

    // describe("#on_recv", async () =>
    // {
    //     it("是否能接受到信息", async () =>
    //     {
    //         await new Promise(async (succ) =>
    //         {
    //             badbadconnection.on_recv((msg: string) =>
    //             {
    //                 should(msg).equal(test_msg)
    //                 succ()
    //             })
    //             await sleep(5e3)
    //             test_send()
    //         })
    //     })
    // })

    // describe("#send", async () =>
    // {
    //     it("能否发送信息", async () =>
    //     {
    //         await browser.webContents.executeJavaScript(`
    //             test_recv = "test"
    //             goeasy.subscribe({
    //                 channel:'${channel}',
    //                 onMessage: function(message)
    //                 {
    //                     test_recv = message.content
    //                 }
    //             });
    //         `)
    //         badbadconnection.send(test_msg)
    //         await sleep(3e3)
    //         let test_recv = await browser.webContents.executeJavaScript(`"" + test_recv`)
    //         should(test_recv).equal(test_msg)
    //     })
    // })

    describe("#send than resv", async () =>
    {
        // it("每次只发一条信息", async () =>
        // {
        //     let b1 = await new Badbadconnection(channel).init()
        //     let b2 = await new Badbadconnection(channel).init()
        //     let resv_count = 0
        //     b1.on_recv((msg: string) =>
        //     {
        //         if(msg == test_msg)
        //         {
        //             resv_count ++;
        //         }
        //     })
        //     b2.send(test_msg)
        //     await sleep(5 * 1e3)
        //     should(resv_count).equal(1)
        // })

        it("不会受到自己发送的信息", async () =>
        {
            let b1 = await new Badbadconnection(channel).init()
            let b2 = await new Badbadconnection(channel).init()
            let b1_send = `b1_send${Math.random()}`
            let b1_resv: string = ""
            let b2_resv: string = ""
            b1.on_recv((msg: string) =>
            {
                b1_resv = msg
            })
            b2.on_recv((msg: string) =>
            {
                b2_resv = msg
            })
            b1.send(b1_send)
            await sleep(1e3)
            should(b1_resv).not.equal(b1_send)
            should(b2_resv).equal(b1_send)
        })
    })
})