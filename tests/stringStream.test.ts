import { readChar } from "../src/core/stringStream";

describe("String Stream Function Testing", () => {

    describe("readChar", () => {
        it("Starting Whitespace", () => {
            expect(readChar("   abc")).toEqual(["a", "bc"])
        })

        it("Whitespace in center", () => {
            expect(readChar("a  bc")).toEqual(["a", "  bc"])
        })

        it("chained", () => {
            expect(readChar(readChar("a  bc")[1])).toEqual(["b", "c"])
        })
    })


}) // String Stream Testing