import { Package_helper, Message_data, quick_random_md5, Data_package, DATA_PACKAGE_AREADY_EXISTS } from "./../src/Package_helper";
import should from "should";
import _ from "lodash";

describe("Package_helper内各种内容测试", function ()
{
    it("- quick_random_md5", () =>
    {
        let random_md5_list = []
        let loop_count = 1000
        for(;;)
        {
            random_md5_list.push(quick_random_md5())
            loop_count --
            if(loop_count < 0) break
        }
        let test_list = _.uniq(random_md5_list)
        should(test_list.length).equal(random_md5_list.length)
        
    })
    
    describe("# Package_helper static function", () =>
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

    describe("# Message_data instance function", () =>
    {
        it("- find_data_package_index", () =>
        {
            let data_package = new Data_package()
            data_package.sending_package_md5 = "qwerqwerqwerqwerqwerqwerqwerqwer"
            data_package.msg_md5 = "asdfasdfasdfasdfasdfasdfasdfasdf"
            let total = "0000000000200"
            data_package.total_length = 200
            let current = "0000000000120"
            data_package.current_index = 120
            data_package.package_data = "datadatadatadata"
            let message_data = new Message_data(data_package.msg_md5)
            let index = message_data.find_data_package_index(data_package.sending_package_md5)
            should(index).equal(-1)
            message_data.data_package_list.push(data_package)
            index = message_data.find_data_package_index(data_package.sending_package_md5)
            should(index).equal(0)
        })

        it("- add_data_package", () =>
        {
            let data_package = new Data_package()
            data_package.sending_package_md5 = "qwerqwerqwerqwerqwerqwerqwerqwer"
            data_package.msg_md5 = "asdfasdfasdfasdfasdfasdfasdfasdf"
            let total = "0000000000200"
            data_package.total_length = 200
            let current = "0000000000120"
            data_package.current_index = 120
            data_package.package_data = "datadatadatadata"
            let message_data = new Message_data(data_package.msg_md5)
            let index = message_data.find_data_package_index(data_package.sending_package_md5)
            should(index).equal(-1)
            message_data.add_data_package(data_package)
            index = message_data.find_data_package_index(data_package.sending_package_md5)
            should(index).equal(0)
            try
            {
                message_data.add_data_package(data_package)
            }
            catch(e)
            {
                should(e instanceof DATA_PACKAGE_AREADY_EXISTS).equal(true)
            }
        })
    })

    describe("# Package_helper instance function", () =>
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