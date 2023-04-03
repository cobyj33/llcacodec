import { numberPairArrayToMatrix, getCellBoundingBox, uniqueNumberPairArray, throws } from "../src/core/util";

describe("Get bounding box", () => {
    it("Square 2x2", () => {
        expect(getCellBoundingBox([
            [0, 0],
            [1, -1],
            [0, -1],
            [1, 0]
        ])).toEqual({ x: 0, y: 0, width: 2, height: 2 })
    })

    it("Square 3x3", () => {
        expect(getCellBoundingBox([
            [0, 0],
            [0, -1],
            [0, -2],
            [1, 0],
            [1, -1],
            [1, -2],
            [2, 0],
            [2, -1],
            [2, -2],
        ])).toEqual({ x: 0, y: 0, width: 3, height: 3 })
    })

    it("Moore's Neighbors ", () => {
        expect(getCellBoundingBox([
            [0, 0],
            [0, -1],
            [0, -2],
            [1, 0],
            [1, -2],
            [2, 0],
            [2, -1],
            [2, -2],
        ])).toEqual({ x: 0, y: 0, width: 3, height: 3 })
    })
})

describe("Unique Number pair array", () => {
    it("Multiple Duplicates", () => {
        expect(uniqueNumberPairArray([
            [1, 2],
            [2, 3],
            [4, 7],
            [1, 2],
            [2, 3],
            [2, 3],
            [2, 3],
            [1, 2]
        ])).toEqual([
            [1, 2],
            [2, 3],
            [4, 7]
        ])
    })
})

describe("Number pair array to matrix", () => {

    it("Square 2x2", () => {
        expect(numberPairArrayToMatrix([
            [0, 0],
            [1, -1],
            [0, -1],
            [1, 0]
        ])).toEqual([
            [1, 1],
            [1, 1]
        ])
    })

    it("Square 3x3", () => {
        expect(numberPairArrayToMatrix([
            [0, 0],
            [0, -1],
            [0, -2],
            [1, 0],
            [1, -1],
            [1, -2],
            [2, 0],
            [2, -1],
            [2, -2],
        ])).toEqual([
            [1, 1, 1],
            [1, 1, 1],
            [1, 1, 1],
        ])
    })

    it("Moore's Neighbors ", () => {
        expect(numberPairArrayToMatrix([
            [0, 0],
            [0, -1],
            [0, -2],
            [1, 0],
            [1, -2],
            [2, 0],
            [2, -1],
            [2, -2],
        ])).toEqual([
            [1, 1, 1],
            [1, 0, 1],
            [1, 1, 1],
        ])
    })

})

describe("throws", () => {

    it("Consumes thrown error", () => {
        expect(() => throws( () => { throw new Error("This is a thrown error") } )).not.toThrow()
    })

    it("Does not throw when passed function does not throw", () => {
        expect(() => throws( () => 1 + 1 )).not.toThrow()
    })

    it("Does throw", () => {
        expect(throws( () => { throw new Error("This is a thrown error") } )).toBe(true)
    })

    it("Does not throw", () => {
        expect(throws(() => 1 + 1)).toBe(false)
    })

})