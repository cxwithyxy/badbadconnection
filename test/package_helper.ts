import { Package_helper, Message_data, quick_random_md5, Data_package, DATA_PACKAGE_AREADY_EXISTS, DATA_PACKAGE_NOT_FOUND_IN_MESSAGE_DATA, ARGUMENTS_MISS} from "./../src/Package_helper";
import should from "should";
import _ from "lodash";
import { isUndefined } from "util";

describe("Package_helper内各种内容测试", function ()
{
    function get_random_big_msg(max_msg_length: number)
    {
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
        return big_msg
    }

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
            let max_msg_length = 991
            let big_msg: string = get_random_big_msg(max_msg_length)
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

        it("- find_data_package", () =>
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
            message_data.add_data_package(data_package)
            let temp_data_package = message_data.find_data_package({sending_package_md5: data_package.sending_package_md5})
            should(data_package).equal(temp_data_package)
            temp_data_package = message_data.find_data_package({current_index: data_package.current_index})
            should(data_package).equal(temp_data_package)
            try
            {
                message_data.find_data_package({})
            }
            catch(e)
            {
                should(e instanceof ARGUMENTS_MISS).equal(true)
            }
            try
            {
                message_data.find_data_package({sending_package_md5: "????????????????????????????????"})
            }
            catch(e)
            {
                should(e instanceof DATA_PACKAGE_NOT_FOUND_IN_MESSAGE_DATA).equal(true)
            }
        })

        it("- get_message_content", async () =>
        {
            let message_data!: Message_data
            let max_msg_length = 999
            let big_msg: string = get_random_big_msg(max_msg_length)
            await Package_helper.package_string_making_loop(
                big_msg,
                193,
                async (package_string:string , package_md5: string) =>
                {
                    let data_package = Package_helper.parse_data_package(package_string)
                    if(isUndefined(message_data))
                    {
                        message_data = new Message_data(<string>data_package.msg_md5)
                    }
                    message_data.add_data_package(data_package)
                }
            )
            let recv_message = message_data.get_message_content()
            should(recv_message).equal(big_msg)
        })

        it("- clean_up", async () =>
        {
            let message_data!: Message_data
            let max_msg_length = 999
            let big_msg: string = get_random_big_msg(max_msg_length)
            await Package_helper.package_string_making_loop(
                big_msg,
                193,
                async (package_string:string , package_md5: string) =>
                {
                    let data_package = Package_helper.parse_data_package(package_string)
                    if(isUndefined(message_data))
                    {
                        message_data = new Message_data(<string>data_package.msg_md5)
                    }
                    message_data.add_data_package(data_package)
                }
            )
            should(message_data.message_content).undefined()
            let recv_message = message_data.get_message_content()
            should(recv_message).equal(message_data.message_content)
            message_data.clean_up()
            should(message_data.message_content).undefined()
        })
    })

    describe("# Data_package instance function", () =>
    {
        it("- is_endding_package", () =>
        {
            let p_md5 = "qwerqwerqwerqwerqwerqwerqwerqwer"
            let msgmd5 = "asdfasdfasdfasdfasdfasdfasdfasdf"
            let total = "0000000000200"
            let current = "0000000000184"
            let data = "datadatadatadata"
            let test_package_string = [p_md5, msgmd5, total, current, data].join("")
            let test_data_package = Package_helper.parse_data_package(test_package_string)
            should(test_data_package.is_endding_package()).true()
            current = "0000000000180"
            test_package_string = [p_md5, msgmd5, total, current, data].join("")
            test_data_package = Package_helper.parse_data_package(test_package_string)
            should(test_data_package.is_endding_package()).false()
        })
    })

    describe("# Package_helper instance function", () =>
    {
        let ph !: Package_helper
        beforeEach(() => 
        {
            ph = new Package_helper()
        })

        it("- find_message_data_index", () =>
        {
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
            let msgmd5 = "asdfasdfasdfasdfasdfasdfasdfasdf"
            let message_data = ph.setup_message_data(msgmd5)
            should(message_data.msg_md5).equal(msgmd5)
            should(ph.message_data_list.length).equal(1)
            should(ph.setup_message_data(msgmd5).msg_md5).equal(msgmd5)
        })

        it("- add_source_str_to_message_data", async () =>
        {
            let max_msg_length = 999
            let big_msg: string = get_random_big_msg(max_msg_length)
            await Package_helper.package_string_making_loop(
                big_msg,
                193,
                async (package_string:string , package_md5: string) =>
                {
                    ph.add_source_str_to_message_data(package_string)
                }
            )
            let temp_msg = ph.message_data_list[0].get_message_content()
            should(temp_msg).equal(big_msg)
        })

        it("E message_finish", () =>
        {
            let max_msg_length = 999
            let big_msg: string = get_random_big_msg(max_msg_length)
            return new Promise(async succ =>
            {
                ph.on("message_finish", (message_data: Message_data) =>
                {
                    should(message_data.get_message_content()).equal(big_msg)
                    succ()
                })

                await Package_helper.package_string_making_loop(
                    big_msg,
                    193,
                    async (package_string:string , package_md5: string) =>
                    {
                        ph.add_source_str_to_message_data(package_string)
                    }
                )
            })
        })
    })
})