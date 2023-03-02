import { readLifeRuleString, makeLifeRuleString, canMakeLifeString, isValidLifeRuleString } from "../formats/rule"

describe("canMakeLifeString", () => {

    it("Conway", () => {
        expect(canMakeLifeString([3], [2, 3])).toBe(true)
    })

    it("Seeds", () => {
        expect(canMakeLifeString([2], [])).toBe(true)
    })

    describe("Births Parameter", () => {
        it("Duplicate", () => {
            expect(canMakeLifeString([2, 3, 3, 4], [3, 4])).toBe(false)
        })
    
        it("Negative", () => {
            expect(canMakeLifeString([2, -3, 4], [3, 4])).toBe(false)
        })
    
        it("Decimal", () => {
            expect(canMakeLifeString([2, 3.3, 4], [3, 4])).toBe(false)
        })

        it("NaN", () => {
            expect(canMakeLifeString([2, NaN, 4], [3, 4])).toBe(false)
        })

        it("Nine", () => {
            expect(canMakeLifeString([2, 4, 9], [3, 4])).toBe(false)
        })

        it("Larger than 8", () => {
            expect(canMakeLifeString([2, 43, 293], [3, 4])).toBe(false)
        })

        it("Empty", () => {
            expect(canMakeLifeString([], [3, 4])).toBe(true);
        })
    })

    describe("Survival Parameter", () => {
        it("Duplicate", () => {
            expect(canMakeLifeString([2, 3, 4], [1, 1, 3, 4])).toBe(false)
        })
    
        it("Negative", () => {
            expect(canMakeLifeString([2, 3, 4], [-1, 3, 4])).toBe(false)
        })
    
        it("Decimal", () => {
            expect(canMakeLifeString([2, 3, 4], [3, 4, 5.23])).toBe(false)
        })

        it("NaN", () => {
            expect(canMakeLifeString([2, 4], [3, 4, NaN])).toBe(false)
        })

        it("Nine", () => {
            expect(canMakeLifeString([2, 4], [3, 4, 9])).toBe(false)
        })

        it("Larger than 8", () => {
            expect(canMakeLifeString([2], [3, 43])).toBe(false)
        })

        it("Empty", () => {
            expect(canMakeLifeString([3, 4], [])).toBe(true);
        })
    })
})
    
// describe("readLifeRuleString", () => {
//     describe("S/B", () => {
//         it("")
//     })

//     describe("B/S", () => {

//     })
// })

// describe("isValidLifeRuleString", () => {

// })

describe("makeLifeRuleString", () => {
    describe("S/B", () => {
        it("Ideal", () => {
            expect(makeLifeRuleString([2, 3, 4], [3, 4], "S/B")).toBe("34/234")
        })

        it("Decimal", () => {
            expect(() => makeLifeRuleString([2.5, 3, 4], [3, 4], "S/B")).toThrow()
        })

        it("Negative Number", () => {
            expect(() => makeLifeRuleString([2, 3, 4], [-3, 4], "S/B")).toThrow()
        })

        it("Unsorted Numbers", () => {
            expect(makeLifeRuleString([5, 2, 4, 3], [4, 3], "S/B")).toBe("34/2345")
        })

        it("NaN", () => {
            expect(() => makeLifeRuleString([5, 2, NaN, 3], [4, 3], "S/B")).toThrow()
        })

    })

    describe("B/S", () => {

        it("Ideal", () => {
            expect(makeLifeRuleString([2, 3, 4], [3, 4], "B/S")).toBe("B234/S34")
        })

        it("Decimal", () => {
            expect(() => makeLifeRuleString([2.5, 3, 4], [3, 4], "B/S")).toThrow()
        })

        it("Negative Number", () => {
            expect(() => makeLifeRuleString([2, 3, 4], [-3, 4], "B/S")).toThrow()
        })

        it("Unsorted Numbers", () => {
            expect(makeLifeRuleString([5, 2, 4, 3], [4, 3], "B/S")).toBe("B2345/S34")
        })

        it("NaN", () => {
            expect(() => makeLifeRuleString([5, 2, NaN, 3], [4, 3], "B/S")).toThrow()
        })

    })
})