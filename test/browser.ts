import { Browser } from "../src/Browser";
import sleep from "sleep-promise";

describe("Browser", function ()
{
    this.timeout(10 * 60e3)
    let browser

    beforeEach(async () =>
    {
        let browser = new Browser().init()
    })

    describe("#constructor", async () =>
    {

        it("能够启动", async () =>
        {
            await sleep(10 * 60e3)
        })
        
    })
})