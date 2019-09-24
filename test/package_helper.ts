import { Package_helper } from "./../src/Package_helper";
import should from "should";

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
        it("- parse_package_string", () =>
        {
            let p_md5 = "qwerqwerqwerqwerqwerqwerqwerqwer"
            let msgmd5 = "asdfasdfasdfasdfasdfasdfasdfasdf"
            let total = "0000000000200"
            let current = "0000000000120"
            let data = "datadatadatadata"
            let test_package_string = [p_md5, msgmd5, total, current, data].join("")
            should(Package_helper.parse_package_string(test_package_string,"md5")).equal(p_md5)
            should(Package_helper.parse_package_string(test_package_string,"msgmd5")).equal(msgmd5)
            should(Package_helper.parse_package_string(test_package_string,"total")).equal(total)
            should(Package_helper.parse_package_string(test_package_string,"current")).equal(current)
            should(Package_helper.parse_package_string(test_package_string,"data")).equal(data)
        })

        it("- parse_data_package", () =>
        {
            let p_md5 = "qwerqwerqwerqwerqwerqwerqwerqwer"
            let msgmd5 = "asdfasdfasdfasdfasdfasdfasdfasdf"
            let total = "0000000000200"
            let total_number = 200
            let current = "0000000000120"
            let current_numebr = 120
            let data = "datadatadatadata"
            let test_package_string = [p_md5, msgmd5, total, current, data].join("")
            let test_data_package = Package_helper.parse_data_package(test_package_string)
            should(test_data_package.sending_package_md5).be.String().equal(p_md5)
            should(test_data_package.msg_md5).be.String().equal(msgmd5)
            should(test_data_package.total_length).be.Number().equal(total_number)
            should(test_data_package.current_index).be.Number().equal(current_numebr)
            should(test_data_package.package_data).be.String().equal(data)
        })

        it("- package_string_making_loop", async () =>
        {
            await Package_helper.package_string_making_loop(
                big_msg,
                200,
                async (package_string, package_md5) => {
                    // console.log(package_string);
                }
            )
        })
    })
})