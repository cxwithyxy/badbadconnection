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
        b1 = await new Badbadconnection(channel).init()
        // b2 = await new Badbadconnection(channel).init()
    })

    afterEach(async () =>
    {
        await b1.close()
        // await b2.close()
    })

    describe("基础通讯", async () =>
    {
        it("发信息并收信息", async () =>
        {
            await sleep(5e3)
        })
    })
})