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
        it("- package_string_making_loop", async () =>
        {
            Package_helper.package_string_making_loop(
                big_msg,
                200,
                async (package_string, package_md5) => {
                    console.log(package_string);
                }
            )
        })
    })
})