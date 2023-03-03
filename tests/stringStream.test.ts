import { StringStream } from "../core/stringStream";

describe("String Stream Testing", () => {

    describe("Construction", () => {
        it("Initial Index", () => {
            const ss = new StringStream("libcaread");
            expect(ss.index).toBe(0)
        })

        describe("Remaining Characters", () => {
            it("single word", () => {
                const ss = new StringStream("libcaread");
                expect(ss.remainingCharacters).toBe(9);
            })
    
            it("With a newline", () => {
                const ss = new StringStream("libcaread\ngol");
                expect(ss.remainingCharacters).toBe(13);
            })
    
            it("newLines", () => {
                const ss = new StringStream("\n\n\n");
                expect(ss.remainingCharacters).toBe(3);
            })
        }) // String Stream Testing -> Construction -> Remaining Characters


        describe("isFinished", () => {
            it("single word", () => {
                const ss = new StringStream("libcaread");
                expect(ss.isFinished()).toBe(false);
            })

            it("Empty String", () => {
                const ss = new StringStream("");
                expect(ss.isFinished()).toBe(true);
            })
        }) // String Stream Testing -> Construction -> isFinished

        describe("inputLength", () => {

            it("single word", () => {
                const ss = new StringStream("libcaread");
                expect(ss.inputLength).toBe(9);
            })

            it("With a newline", () => {
                const ss = new StringStream("cobyj33\ngol");
                expect(ss.inputLength).toBe(11);
            })

            it("newLines", () => {
                const ss = new StringStream("\n\n\n");
                expect(ss.inputLength).toBe(3);
            })

        }) // String Stream Testing -> Construction -> inputLength

    }) // String Stream Testing -> Construction

    describe("Reading", () => {

        describe("readLine", () => {
            it("Multiple empty lines", () => {
                const ss = new StringStream(
                    "\n\n\n"
                    )
                expect(ss.readLine()).toBe("")
                expect(ss.readLine()).toBe("")
                expect(ss.readLine()).toBe("")
                expect(() => ss.readLine()).toThrow()
            })

            it("Words", () => {
                const ss = new StringStream(
                    "lorem\nipsum\ndolor\nsit\namet"
                )
                expect(ss.readLine()).toBe("lorem")
                expect(ss.readLine()).toBe("ipsum")
                expect(ss.readLine()).toBe("dolor")
                expect(ss.readLine()).toBe("sit")
                expect(ss.readLine()).toBe("amet")
                expect(() => ss.readLine()).toThrow()
            })
        })

    //     describe("isFinished", () => {
    //         it("Multiple empty lines", () => {
    //             const ss = new StringStream("\n\n\n\n");
    //             ss.readLine();
    //         })
    //     })

    //     describe("inputLength", () => {
    //         it("Multiple empty lines", () => {
    //             const ss = new StringStream(
    //                 ""
    //                 )
    //         })
    //     })

    }) // String Stream Testing -> Reading


}) // String Stream Testing