import { readLifeFile } from "../src/api";

describe("readLifeFile", () => {

    describe("Life 1.06", () => {
        it("Line", () => {
            expect(readLifeFile("#Life 1.06\n" +
            "0 0\n" +
            "1 0\n" +
            "2 0\n"
            , "Life 1.06")).toEqual([[0, 0], [1, 0], [2, 0]])

        })
    })

})