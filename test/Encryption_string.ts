import { Encryption_string } from "../src/Encryption_string";
import should from "should";

describe("Encryption_string", function ()
{
    this.timeout(10 * 60e3)
    describe("encode_decode", () =>
    {
        it("can encode and decode", () =>
        {
            let key = `key_${Math.round(Math.random() * 1e9)}`
            let contain_string = `contain_string_${Math.round(Math.random() * 1e9)}`
            let counter = Math.round(Math.random() * 50)
            let encryption_string = new Encryption_string(key, counter)
            let encode_string = encryption_string.encode(contain_string)
            let decode_string = encryption_string.decode(encode_string)
            should(contain_string).equal(decode_string)
        })
    })
})