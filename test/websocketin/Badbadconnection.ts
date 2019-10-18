import { Badbadconnection } from "../../index";
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
        b1 = await new Badbadconnection(channel).select_connection(1).init()
        b2 = await new Badbadconnection(channel).select_connection(1).init()
    })

    afterEach(async () =>
    {
        await b1.close()
        await b2.close()
    })

    describe("基础通讯", async () =>
    {
        it("发信息并收信息", async () =>
        {
            let recv_msg = ""
            await new Promise((succ) =>
            {
                b1.on_recv((msg: string) =>
                {
                    recv_msg = msg
                    succ()
                })
                b2.send(test_msg)
            })
            should(recv_msg).equal(test_msg)
        })
    })
})