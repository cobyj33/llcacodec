import { writePlainTextFromCoordinates, writePlainTextMatrix } from "../formats/plaintext";

describe("write plain text matrix", () => {

    it("Acorn - No Description with empty string", () => {
        const acorn: (0 | 1)[][] = [[0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 1, 1, 0, 0, 1, 1, 1, 0],
        [0, 0, 0, 0, 1, 0, 0, 0, 0],
        [0, 0, 1, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0]]
    
        expect(writePlainTextMatrix(acorn, "Acorn", "")).toEqual(
            "!Name: Acorn\n" +
            "!\n" + 
            ".........\n" +
            ".OO..OOO.\n" +
            "....O....\n" + 
            "..O......\n" +
            ".........\n"
        )
    })

    it("Acorn - No Description with empty array", () => {
        const acorn: (0 | 1)[][] = [[0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 1, 1, 0, 0, 1, 1, 1, 0],
        [0, 0, 0, 0, 1, 0, 0, 0, 0],
        [0, 0, 1, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0]]
    
        expect(writePlainTextMatrix(acorn, "Acorn", [])).toEqual(
            "!Name: Acorn\n" +
            "!\n" + 
            ".........\n" +
            ".OO..OOO.\n" +
            "....O....\n" + 
            "..O......\n" +
            ".........\n"
        )
    })

    it("Acorn - One Line Description", () => {
        const acorn: (0 | 1)[][] = [[0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 1, 1, 0, 0, 1, 1, 1, 0],
        [0, 0, 0, 0, 1, 0, 0, 0, 0],
        [0, 0, 1, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0]]
    
        expect(writePlainTextMatrix(acorn, "Acorn", "A chaotic, classic pattern")).toEqual(
            "!Name: Acorn\n" +
            "!A chaotic, classic pattern\n" +
            "!\n" + 
            ".........\n" +
            ".OO..OOO.\n" +
            "....O....\n" + 
            "..O......\n" +
            ".........\n"
        )
    })

    it("Acorn - Multi Line Description with newChars", () => {
        const acorn: (0 | 1)[][] = [[0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 1, 1, 0, 0, 1, 1, 1, 0],
        [0, 0, 0, 0, 1, 0, 0, 0, 0],
        [0, 0, 1, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0]]
    
        expect(writePlainTextMatrix(acorn, "Acorn", "A chaotic, classic pattern\nfound by Charles Corderman\nFinal bounding box of 215 by 168 cells")).toEqual(
            "!Name: Acorn\n" +
            "!A chaotic, classic pattern\n" +
            "!found by Charles Corderman\n" +
            "!Final bounding box of 215 by 168 cells\n" +
            "!\n" + 
            ".........\n" +
            ".OO..OOO.\n" +
            "....O....\n" + 
            "..O......\n" +
            ".........\n"
        )
    })

    it("Acorn - Multi Line Description with string array", () => {
        const acorn: (0 | 1)[][] = [[0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 1, 1, 0, 0, 1, 1, 1, 0],
        [0, 0, 0, 0, 1, 0, 0, 0, 0],
        [0, 0, 1, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0]]
    
        expect(writePlainTextMatrix(acorn, "Acorn", ["A chaotic, classic pattern",
                                                    "found by Charles Corderman",
                                                    "Final bounding box of 215 by 168 cells"])).toEqual(
            "!Name: Acorn\n" +
            "!A chaotic, classic pattern\n" +
            "!found by Charles Corderman\n" +
            "!Final bounding box of 215 by 168 cells\n" +
            "!\n" + 
            ".........\n" +
            ".OO..OOO.\n" +
            "....O....\n" + 
            "..O......\n" +
            ".........\n"
        )
    })

    it("Acorn - Multi Line Description with string array and newlines", () => {
        const acorn: (0 | 1)[][] = [[0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 1, 1, 0, 0, 1, 1, 1, 0],
        [0, 0, 0, 0, 1, 0, 0, 0, 0],
        [0, 0, 1, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0]]
    
        expect(writePlainTextMatrix(acorn, "Acorn", ["A chaotic, classic pattern\nThe most popular methuselah pattern",
                                                    "found by Charles Corderman",
                                                    "Final bounding box of 215 by 168 cells\nProduces 13 gliders"])).toEqual(
            "!Name: Acorn\n" +
            "!A chaotic, classic pattern\n" +
            "!The most popular methuselah pattern\n" +
            "!found by Charles Corderman\n" +
            "!Final bounding box of 215 by 168 cells\n" +
            "!Produces 13 gliders\n" +
            "!\n" + 
            ".........\n" +
            ".OO..OOO.\n" +
            "....O....\n" + 
            "..O......\n" +
            ".........\n"
        )
    })

})