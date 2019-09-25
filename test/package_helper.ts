import { Package_helper, Message_data } from "./../src/Package_helper";
import should from "should";

describe("Package_helper内各种内容测试", function ()
{
    describe("Package_helper static function", () =>
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

        it("- create_package_string", () =>
        {
            let p_md5 = "qwerqwerqwerqwerqwerqwerqwerqwer"
            let msgmd5 = "asdfasdfasdfasdfasdfasdfasdfasdf"
            let total = "0000000000200"
            let total_number = 200
            let current = "0000000000120"
            let current_numebr = 120
            let data = "datadatadatadata"
            let test_package_string = [p_md5, msgmd5, total, current, data].join("")
            let test = Package_helper.create_package_string(
                p_md5,
                msgmd5,
                total_number,
                current_numebr,
                data
            )
            should(test).be.String().equal(test_package_string)
        })

        it("- package_string_making_loop", async () =>
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
            await Package_helper.package_string_making_loop(
                big_msg,
                200,
                async (package_string:string , package_md5: string) => {
                    should(package_md5.length).be.equal(32)
                    let temp_data_package = Package_helper.parse_data_package(package_string)
                    should(temp_data_package.total_length).equal(big_msg.length)
                    should((<string>temp_data_package.package_data).length).lessThanOrEqual(200)
                    let data_position = big_msg.indexOf(<string>temp_data_package.package_data)
                    should(data_position).not.equal(-1)
                    should(data_position).equal(temp_data_package.current_index)
                    should(<number>temp_data_package.current_index % 200).equal(0)
                }
            )
        })
    })

    describe("Package_helper instance function", () =>
    {
        it("- find_message_data_index", () =>
        {
            let ph = new Package_helper()
            let msgmd5 = "asdfasdfasdfasdfasdfasdfasdfasdf"
            let wrong_msgmd5 = "ghjkghjkghjkghjkghjkghjkghjkghjk"
            ph.message_data_list = [new Message_data(msgmd5)]
            let index = ph.find_message_data_index(msgmd5)
            should(index).equal(0)
            index = ph.find_message_data_index(wrong_msgmd5)
            should(index).equal(-1)
        })

        it("- setup_message_data", () =>
        {
            let ph = new Package_helper()
            let msgmd5 = "asdfasdfasdfasdfasdfasdfasdfasdf"
            let message_data = ph.setup_message_data(msgmd5)
            should(message_data.msg_md5).equal(msgmd5)
            should(ph.message_data_list.length).equal(1)
            should(ph.setup_message_data(msgmd5).msg_md5).equal(msgmd5)
        })
    })
})