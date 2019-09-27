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
        await b1.close()
        await b2.close()
    })

    describe("基础通讯", async () =>
    {
        // it("发信息并收信息", async () =>
        // {
        //     let recv_msg = ""
        //     await new Promise((succ) =>
        //     {
        //         b1.on_recv((msg: string) =>
        //         {
        //             recv_msg = msg
        //             succ()
        //         })
        //         b2.send(test_msg)
        //     })
        //     should(recv_msg).equal(test_msg)
        // })

        // it("每次只发一条信息", async () =>
        // {
        //     let recv_str_list: string[] = []
        //     let send_time_loop = 5
        //     b1.on_recv((msg: string) =>
        //     {
        //         recv_str_list.push(msg)
        //     })
        //     for(let i  = 0; i < 5; i++)
        //     {
        //         await b2.send(`${test_msg}${i}`)
        //     }
        //     await sleep(5 * 1e3)
        //     should(recv_str_list.length).equal(send_time_loop)
        //     for(let i  = 0; i < 5; i++)
        //     {
        //         should(recv_str_list[i]).equal(`${test_msg}${i}`)
        //     }
        // })

        // it("不会受到自己发送的信息", async () =>
        // {
        //     let b1_send = `b1_send${Math.random()}`
        //     let b1_recv: string = ""
        //     let b2_recv: string = ""
        //     let b2_promise = new Promise((succ) =>
        //     {
        //         b2.on_recv((msg: string) =>
        //         {
        //             b2_recv = msg
        //             succ()
        //         })
        //     })
        //     let b1_promise = new Promise((succ) =>
        //     {
        //         b1.on_recv((msg: string) =>
        //         {
        //             b1_recv = msg
        //             succ()
        //         })
        //         setTimeout(() =>
        //         {
        //             succ()
        //         }, 5e3)
        //     })
        //     await b1.send(b1_send)
        //     await Promise.all([b1_promise, b2_promise])
        //     should(b1_recv).not.equal(b1_send)
        //     should(b2_recv).equal(b1_send)
        // })

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

        it("大数据发送", () =>
        {
            let long_text = get_random_big_msg(10 * 1024)
            return new Promise(async succ =>
            {
                b2.on_recv((msg: string) =>
                {
                    should(msg).equal(long_text)
                    succ()
                })
                await b1.send(long_text)
            })
        })
    })

})