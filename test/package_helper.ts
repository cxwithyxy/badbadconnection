import { Package_helper } from "./../src/Package_helper";

describe("Package_helper内各种内容测试", function ()
{
    let max_msg_length = 1000
    let big_msg: string
    big_msg = ""
    for(;;)
    {
        big_msg += String(Math.random()*10e3)
        if(big_msg.length > max_msg_length)
        {
            break
        }
    }

    describe("Package_helper", () =>
    {
        it("- create_package_string", () =>
        {
            // let ps = Package_helper.create_package_string()
        })
    })
})