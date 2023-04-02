import { readChar, readInteger, readIntegers, readLine, readNegativeInteger, readNext, readNumber } from "../src/core/strRead";

describe("String Stream Function Testing", () => {

    describe("readNext", () => {
        it("Word", () => {
            expect(readNext("Jacoby Johnson")).toEqual(["Jacoby", " Johnson"])
        })

        it("Chained Words", () => {
            const [, remaining] = readNext("Jacoby Aidan Johnson")
            expect(readNext(remaining)).toEqual(["Aidan", " Johnson"])
        })

        it("Leading whitespace", () => {
            expect(readNext("   Jacoby Johnson")).toEqual(["Jacoby", " Johnson"])
        })

        it("Number String", () => {
            expect(readNext("-25 42")).toEqual(["-25", " 42"])
        })

        it("Empty String", () => {
            expect(() => readNext("")).toThrow()
        })

        it("Whitespace only string", () => {
            expect(() => readNext("     ")).toThrow()
        })

        it("No Whitespace", () => {
            expect(readNext("Jacoby")).toEqual(["Jacoby", ""])
        })
    })

    describe("readLine", () => {
        it("Single line", () => {
            expect(readLine("This is one line.")).toEqual(["This is one line.", ""])
        })

        it("Single line with ending newline", () => {
            expect(readLine("This is one line.\n")).toEqual(["This is one line.", ""])
        })

        it("Two Lines", () => {
            expect(readLine("This is one line.\nThis is another line.")).toEqual(["This is one line.", "This is another line."])
        })

        it("Three Lines", () => {
            expect(readLine("This is one line.\nThis is another line.\nThis is yet another line")).toEqual(["This is one line.", "This is another line.\nThis is yet another line"])
        })

        it("Multiple Newlines in a row", () => {
            expect(readLine(" \n\n ")).toEqual([" ", "\n "])
        })

        it("No more lines", () => {
            expect(() => readLine("")).toThrow()
        })

        it("Whitespace - No Throw", () => {
            expect( () => readLine(" ")).not.toThrow();
        })

        it("Whitespace", () => {
            expect(readLine("  ")).toEqual(["  ", ""])
        })

        it("MS-DOS type lines", () => {
            expect(readLine("Hello.\r\nI am annoying\r\n")).toEqual(["Hello.", "I am annoying\r\n"])
        })

        it("Just a newline", () => {
            expect(readLine("\n")).toEqual(["", ""])
        })
    })

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

        it("Incorrect input", () => {
            expect(() => readChar("abc", "b")).toThrow()
        })
        
        it("Whitespace input", () => {
            expect(() => readChar(" abc", " ")).toThrow()
        })

        it("Empty input", () => {
            expect(readChar(" abc", "")).toEqual(["a", "bc"])
        })

        it("consecutive calls", () => {
            const str = "This\nIs\nA\nFile"
            const output: string[] = []
            let remaining = str;
            for (let i = 0; i < 4; i++) {
                const [read, left] = readLine(remaining)
                output.push(read)
                remaining = left;
            }

            expect(output).toEqual(["This", "Is", "A", "File"])
        })


    })

    describe("readNumber", () => {

        describe("Negative Numbers", () => {
            it("Single digit", () => {
                expect(readNumber("-2 -42")).toEqual([-2, " -42"])
            })

            it("Only a negative sign digit", () => {
                expect(readNumber("-2 -42")).toEqual([-2, " -42"])
            })

            it("Right at beginning", () => {
                expect(() => readNumber("- 25 -42")).toThrow()
            })

            it("With spacing at beginning", () => {
                expect(readNumber("  -25 -42")).toEqual([-25, " -42"])
            })

            it("With spacing at ending", () => {
                expect(readNumber("-25 -42  ")).toEqual([-25, " -42  "])
            })

            it("With no spacing after read", () => {
                expect(readNumber("-25")).toEqual([-25, ""])
            })

            it("With no spacing after read and a trailing decimal", () => {
                expect(readNumber("-25.")).toEqual([-25., ""])
            })

            it("With no spacing after read and a trailing point zero", () => {
                expect(readNumber("-25.0")).toEqual([-25.0, ""])
            })
        })


    })

    describe("readTest", () => {

    })

    describe("readInteger", () => {

    })

    describe("readIntegers", () => {

        it("Reading two positive integers", () => {
            expect(readIntegers(" 20 22", 2)).toEqual([[20, 22], ""])
        })

        it("Reading two negative integers", () => {
            expect(readIntegers(" -20 -22", 2)).toEqual([[-20, -22], ""])
        })

        it("Reading two negative integers with no whitespace at beginning", () => {
            expect(readIntegers("-20 -22", 2)).toEqual([[-20, -22], ""])
        })

        it("Reading two negative integers with whitespace at end", () => {
            expect(readIntegers("-20 -22 ", 2)).toEqual([[-20, -22], " "])
        })

        it("Reading integer with leading zeros", () => {
            expect(readIntegers("   0054 -00032 ", 2)).toEqual([[54, -32], " "])
        })

        it("Reading 5 alternative negative and positive integers with varying whitespace", () => {
            expect(readIntegers("-20 22 1 2345 -43 Some words at the end", 5)).toEqual([[-20, 22, 1, 2345, -43], " Some words at the end"])
        })

        describe("readInteger equivalence", () => {
            
            it("Positive", () => {
                expect(readIntegers("  35   ", 1)).toEqual([[35], "   "])
                expect(readInteger("  35   ")).toEqual([35, "   "])
            })
        })

        describe("Will throw", () => {
            it("Reading a float", () => {
                expect(() => readIntegers("23 3.45 words", 2)).toThrow()
            })

            it("Reading a number with a misplaced negative", () => {
                expect( () => readIntegers(" 44 54-3 -33", 3)).toThrow()
            })
        })
    })


}) // String Stream Testing