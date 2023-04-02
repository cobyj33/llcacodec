import { readLifeString } from "../src/api";

describe("readLifeString", () => {

    describe("Life 1.06", () => {
        it("Line", () => {
            expect(readLifeString("#Life 1.06\n" +
            "0 0\n" +
            "1 0\n" +
            "2 0\n"
            , "life 1.06")).toEqual({
                format: "life 1.06",
                liveCoordinates: [[0, 0], [1, 0], [2, 0]]
            })

        })
    })

})