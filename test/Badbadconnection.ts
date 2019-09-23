import { Badbadconnection } from "../index";
import sleep from "sleep-promise";
import should from "should";

describe("Badbadconnection", function ()
{
    this.timeout(10 * 60e3)
    let channel: string
    let test_msg: string
    let b1: Badbadconnection
    let b2: Badbadconnection


    beforeEach(async () =>
    {
        channel = `test${Math.round(Math.random() * 1e6)}`
        test_msg = `test_msg${Math.round(Math.random() * 1e6)}`
        b1 = await new Badbadconnection(channel).init()
        b2 = await new Badbadconnection(channel).init()
    })

    afterEach(async () =>
    {
        b1.close()
        b2.close()
        await sleep(5e3)
    })

    describe("基础通讯", async () =>
    {
        it("每次只发一条信息", async () =>
        {
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

        it("不会受到自己发送的信息", async () =>
        {
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