import { writeLife106String, readLife106String } from "../formats/life106"


describe("Reading", () => {
    it("Basic", () => {
        expect(readLife106String("#Life 1.06\n" +
            "0 0\n" +
            "1 0\n" +
            "2 0\n")).toEqual([[0, 0], [1, 0], [2, 0]])
    })

    it("Negatives", () => {
        expect(readLife106String("#Life 1.06\n" +
            "0 0\n" +
            "-1 0\n" +
            "2 0\n" +
            "3 -1\n")).toEqual([[0, 0], [-1, 0], [2, 0], [3, -1]])
    })

    it("Duplicates", () => {
        expect(readLife106String("#Life 1.06\n" +
            "0 0\n" +
            "-1 0\n" +
            "2 0\n" +
            "2 0\n" +
            "3 -1\n")).toEqual([[0, 0], [-1, 0], [2, 0], [3, -1]])
    })

    it("Empty Lines at end", () => {
        expect(readLife106String("#Life 1.06\n" +
            "0 0\n" +
            "-1 0\n" +
            "2 0\n" +
            "3 -1\n\n\n")).toEqual([[0, 0], [-1, 0], [2, 0], [3, -1]])
    })

    it("No newline at end", () => {
        expect(readLife106String("#Life 1.06\n" +
            "0 0\n" +
            "-1 0\n" +
            "2 0\n" +
            "3 -1")).toEqual([[0, 0], [-1, 0], [2, 0], [3, -1]])
    })

    it("Decimals", () => {
        expect(() => readLife106String("#Life 1.06\n" +
            "0.5 0\n" +
            "-1 0\n" +
            "2.3 0\n" +
            "3 -1.2\n")).toThrow()
    })

    it("Extra newline between header and coordinates", () => {
        expect(() => readLife106String("#Life 1.06\n\n" +
            "0 0\n" +
            "-1 0\n" +
            "2 0\n" +
            "3 -1\n")).toThrow()
    })

    it("Extra space at ends of coordinate lines", () => {
        expect(readLife106String("#Life 1.06\n" +
            "0 0 \n" +
            "-1 0 \n" +
            "2 0 \n" +
            "3 -1 \n")).toEqual([[0, 0], [-1, 0], [2, 0], [3, -1]])
    })

    it("Extra space at beginnings of coordinate lines", () => {
        expect(readLife106String("#Life 1.06\n" +
            " 0 0 \n" +
            " -1 0 \n" +
            " 2 0 \n" +
            " 3 -1 \n")).toEqual([[0, 0], [-1, 0], [2, 0], [3, -1]])
    })

    it("Extra space between coordinates of coordinate lines", () => {
        expect(readLife106String("#Life 1.06\n" +
            " 0  0 \n" +
            " -1  0 \n" +
            " 2       0 \n" +
            " 3  -1 \n")).toEqual([[0, 0], [-1, 0], [2, 0], [3, -1]])
    })


})

describe("Writing", () => {

    it("Writing nothing", () => {
        expect(writeLife106String([])).toBe("#Life 1.06\n")
    })

    it("Writing values", () => {
        expect(writeLife106String([[1, 1], [2, 2]])).toBe(
            "#Life 1.06\n" +
            "1 1\n" +
            "2 2\n"
        )
    })

    it("Writing Duplicates", () => {
        expect(writeLife106String([[1, 1], [2, 2], [2, 2]])).toBe(
            "#Life 1.06\n" +
            "1 1\n" +
            "2 2\n"
        )
    })
    

})