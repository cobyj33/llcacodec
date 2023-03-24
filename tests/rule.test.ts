import { readLifeRule, makeLifeRule, isValidLifeRule, CONWAY_LIFE_RULE_DATA } from "../src/formats/rule"
import { CONWAY_LIFE_RULE_INTEGER, makeLifeRuleInteger, readLifeRuleInteger } from "../src/formats/rule/int"
import { isValidLifeRuleData } from "../src/formats/rule/ruleData"

describe("readLifeRuleInteger", () => {
    it("Conway", () => {
        expect(readLifeRuleInteger(6152)).toEqual(CONWAY_LIFE_RULE_DATA())
    })
})

describe("readSB", () => {
    describe("S/B no leading letters", () => {
        it("23/3", () => {
            expect(readLifeRule("23/3", "s/b")).toEqual({ birth: [3], survival: [2, 3] })
        })

        it("345/34", () => {
            expect(readLifeRule("345/34", "s/b")).toEqual({ birth: [3, 4], survival: [3, 4, 5] })
        })

        it("/34", () => {
            expect(readLifeRule("/34", "s/b")).toEqual({ birth: [3, 4], survival: [] })
        })

        it("34/", () => {
            expect(readLifeRule("34/", "s/b")).toEqual({ birth: [], survival: [3, 4] })
        })

        it("34/", () => {
            expect(readLifeRule("34/", "s/b")).toEqual({ birth: [], survival: [3, 4] })
        })

        it("8/8", () => {
            expect(readLifeRule("8/8", "s/b")).toEqual({ birth: [8], survival: [8] })
        })
    })

    describe("S/B leading letters", () => {
        it("S23/B3", () => {
            expect(readLifeRule("S23/B3", "s/b")).toEqual({ birth: [3], survival: [2, 3] })
        })

        it("S345/B34", () => {
            expect(readLifeRule("S345/B34", "s/b")).toEqual({ birth: [3, 4], survival: [3, 4, 5] })
        })

        it("S/B34", () => {
            expect(readLifeRule("S/B34", "s/b")).toEqual({ birth: [3, 4], survival: [] })
        })

        it("S34/B", () => {
            expect(readLifeRule("S34/B", "s/b")).toEqual({ birth: [], survival: [3, 4] })
        })

        it("S34/B", () => {
            expect(readLifeRule("S34/B", "s/b")).toEqual({ birth: [], survival: [3, 4] })
        })

        it("S8/B8", () => {
            expect(readLifeRule("S8/B8", "s/b")).toEqual({ birth: [8], survival: [8] })
        })
    })

})

describe("makeLifeRuleInteger", () => {
    it("Conway", () => {
        expect(makeLifeRuleInteger(CONWAY_LIFE_RULE_DATA())).toEqual(CONWAY_LIFE_RULE_INTEGER)
    })
})

describe("isValidLifeRuleData", () => {

    it("Conway", () => {
        expect(isValidLifeRuleData({ birth: [3], survival: [2, 3] })).toBe(true)
    })

    it("Seeds", () => {
        expect(isValidLifeRuleData({ birth: [2], survival: [] })).toBe(true)
    })

    describe("Births Parameter", () => {
        it("Duplicate", () => {
            expect(isValidLifeRuleData({ birth: [2, 3, 3, 4], survival: [3, 4] })).toBe(false)
        })
    
        it("Negative", () => {
            expect(isValidLifeRuleData({ birth: [2, -3, 4], survival: [3, 4] })).toBe(false)
        })
    
        it("Decimal", () => {
            expect(isValidLifeRuleData({ birth: [2, 3.3, 4], survival: [3, 4] })).toBe(false)
        })

        it("NaN", () => {
            expect(isValidLifeRuleData({ birth: [2, NaN, 4], survival: [3, 4] })).toBe(false)
        })

        it("Nine", () => {
            expect(isValidLifeRuleData({ birth: [2, 4, 9], survival: [3, 4] })).toBe(false)
        })

        it("Larger than 8", () => {
            expect(isValidLifeRuleData({ birth: [2, 43, 293], survival: [3, 4] })).toBe(false)
        })

        it("Empty", () => {
            expect(isValidLifeRuleData({ birth: [], survival: [3, 4] })).toBe(true);
        })
    })

    describe("Survival Parameter", () => {
        it("Duplicate", () => {
            expect(isValidLifeRuleData({ birth: [2, 3, 4], survival: [1, 1, 3, 4] })).toBe(false)
        })
    
        it("Negative", () => {
            expect(isValidLifeRuleData({ birth: [2, 3, 4], survival: [-1, 3, 4] })).toBe(false)
        })
    
        it("Decimal", () => {
            expect(isValidLifeRuleData({ birth: [2, 3, 4], survival: [3, 4, 5.23] })).toBe(false)
        })

        it("NaN", () => {
            expect(isValidLifeRuleData({ birth: [2, 4], survival: [3, 4, NaN] })).toBe(false)
        })

        it("Nine", () => {
            expect(isValidLifeRuleData({ birth: [2, 4], survival: [3, 4, 9] })).toBe(false)
        })

        it("Larger than 8", () => {
            expect(isValidLifeRuleData({ birth: [2], survival: [3, 43] })).toBe(false)
        })

        it("Empty", () => {
            expect(isValidLifeRuleData({ birth: [3, 4], survival: [] })).toBe(true);
        })
    })
})
    
// describe("readLifeRule", () => {
//     describe("s/b", () => {
//         it("")
//     })

//     describe("b/s", () => {

//     })
// })

// describe("isValidLifeRule", () => {

// })

describe("makeLifeRule", () => {
    describe("s/b", () => {
        it("Ideal", () => {
            expect(makeLifeRule({ birth: [2, 3, 4], survival: [3, 4] }, "s/b")).toBe("34/234")
        })

        it("Decimal", () => {
            expect(() => makeLifeRule({ birth: [2.5, 3, 4], survival: [3, 4] }, "s/b")).toThrow()
        })

        it("Negative Number", () => {
            expect(() => makeLifeRule({ birth: [2, 3, 4], survival: [-3, 4] }, "s/b")).toThrow()
        })

        it("Unsorted Numbers", () => {
            expect(makeLifeRule({ birth: [5, 2, 4, 3], survival: [4, 3] }, "s/b")).toBe("34/2345")
        })

        it("NaN", () => {
            expect(() => makeLifeRule({ birth: [5, 2, NaN, 3], survival: [4, 3] }, "s/b")).toThrow()
        })

    })

    describe("b/s", () => {

        it("Ideal", () => {
            expect(makeLifeRule({ birth: [2, 3, 4], survival: [3, 4] }, "b/s")).toBe("B234/S34")
        })

        it("Decimal", () => {
            expect(() => makeLifeRule({ birth: [2.5, 3, 4], survival: [3, 4] }, "b/s")).toThrow()
        })

        it("Negative Number", () => {
            expect(() => makeLifeRule({ birth: [2, 3, 4], survival: [-3, 4] }, "b/s")).toThrow()
        })

        it("Unsorted Numbers", () => {
            expect(makeLifeRule({ birth: [5, 2, 4, 3], survival: [4, 3] }, "b/s")).toBe("B2345/S34")
        })

        it("NaN", () => {
            expect(() => makeLifeRule({ birth: [5, 2, NaN, 3], survival: [4, 3] }, "b/s")).toThrow()
        })

    })
})