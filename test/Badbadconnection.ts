import { Badbadconnection } from "../index";
import sleep from "sleep-promise";
import { BrowserWindow} from "electron";
import should from "should";

describe("Badbadconnection", function ()
{
    this.timeout(10 * 60e3)
    let badbadconnection: Badbadconnection
    let channel: string
    let test_msg: string
    let browser: BrowserWindow

    async function test_send()
    {
        await browser.webContents.executeJavaScript(`
            goeasy.publish({
                channel:"${channel}",
                message:"MD5!MD5!MD5!MD5!MD5!MD5!MD5!MD5!${test_msg}"
            })
        `)
    }

    beforeEach(async () =>
    {
        channel = `test${Math.round(Math.random() * 1e6)}`
        test_msg = `test_msg${Math.round(Math.random() * 1e6)}`
        browser = new BrowserWindow({
            width: 400,
            height: 200
        })
        await browser.loadURL("http://www.goeasy.io/cn/demo/chat")
        badbadconnection = await new Badbadconnection(channel).init()
    })

    afterEach(async () =>
    {
        browser.close()
        await sleep(5e3)
    })

    describe("#on_recv", async () =>
    {
        it("是否能接受到信息", async () =>
        {
            await new Promise(async (succ) =>
            {
                badbadconnection.on_recv((msg: string) =>
                {
                    should(msg).equal(test_msg)
                    succ()
                })
                await sleep(5e3)
                test_send()
            })
        })
    })

    describe("#send", async () =>
    {
        it("能否发送信息", async () =>
        {
            await browser.webContents.executeJavaScript(`
                test_recv = "test";
                new Promise((succ) =>
                {
                    goeasy.subscribe({
                        channel:'${channel}',
                        onMessage: function(message)
                        {
                            test_recv = message.content
                        },
                        onSuccess: function () {
                            succ()
                        }
                    });
                });
            `)
            badbadconnection.send(test_msg)
            await sleep(3e3)
            let test_recv:string = await browser.webContents.executeJavaScript(`"" + test_recv`)
            should(test_recv.length).greaterThan(32)
            should(test_recv.substring(32)).equal(test_msg)
        })
    })

    describe("#send one msg", async () =>
    {
        it("每次只发一条信息", async () =>
        {
            let b1 = await new Badbadconnection(channel).init()
            let b2 = await new Badbadconnection(channel).init()
            let recv_count = 0
            b1.on_recv((msg: string) =>
            {
                if(msg == test_msg)
                {
                    recv_count ++;
                }
            })
            b2.send(test_msg)
            await sleep(5 * 1e3)
            should(recv_count).equal(1)
        })
    })

    describe("#not recv what it send", async () =>
    {
        it("不会受到自己发送的信息", async () =>
        {
            let b1 = await new Badbadconnection(channel).init()
            let b2 = await new Badbadconnection(channel).init()
            let b1_send = `b1_send${Math.random()}`
            let b1_recv: string = ""
            let b2_recv: string = ""
            b2.on_recv((msg: string) =>
            {
                b2_recv = msg
            })
            b1.on_recv((msg: string) =>
            {
                b1_recv = msg
            })
            b1.send(b1_send)
            await sleep(2e3)
            should(b1_recv).not.equal(b1_send)
            should(b2_recv).equal(b1_send)
        })
    })
})