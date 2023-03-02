import { writeLife106String, readLife106String } from "../formats/life106"
import { readFile } from "fs/promises"

// describe("conwaylife patterns *.cells", () => {
    
// })

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