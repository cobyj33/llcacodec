import { PlaintextCoordinateWriteData, PlaintextMatrixWriteData, readPlaintextDiagramToXY, readPlaintextString, writePlaintextString } from "../src/formats/file/plaintext";

describe("Reading", () => {

    describe("XY", () => {

        it("Acorn", () => {
            expect(readPlaintextString(
                "!Name: Acorn\n" +
                "!\n" + 
                ".........\n" +
                ".OO..OOO.\n" +
                "....O....\n" + 
                "..O......\n" +
                ".........\n"
            )).toEqual({
                format: "plaintext",
                name: "Acorn",
                description: [],
                matrix: [[0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 1, 1, 0, 0, 1, 1, 1, 0],
                [0, 0, 0, 0, 1, 0, 0, 0, 0],
                [0, 0, 1, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0]],
                liveCoordinates: [
                    [1, -1],
                    [2, -1],
                    [5, -1],
                    [6, -1],
                    [7, -1],
                    [4, -2],
                    [2, -3]
                ]
            })
        })

        it("Acorn w/ Description", () => {
            expect(readPlaintextString(
                "!Name: Acorn\n" +
                "!Acorn is a popular methuselah pattern\n" +
                "!Which grows chaotically over thousands of generations \n"+ 
                "!\n"+ 
                ".........\n" +
                ".OO..OOO.\n" +
                "....O....\n" + 
                "..O......\n" +
                ".........\n"
            )).toEqual({
                format: "plaintext",
                name: "Acorn",
                description: [
                    "Acorn is a popular methuselah pattern",
                    "Which grows chaotically over thousands of generations"
                    ],
                matrix: [[0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 1, 1, 0, 0, 1, 1, 1, 0],
                [0, 0, 0, 0, 1, 0, 0, 0, 0],
                [0, 0, 1, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0]],
                liveCoordinates: [
                    [1, -1],
                    [2, -1],
                    [5, -1],
                    [6, -1],
                    [7, -1],
                    [4, -2],
                    [2, -3]
                ]
            })
        })

        it("Acorn w/ Description and no trailing description line", () => {
            expect(readPlaintextString(
                "!Name: Acorn\n" +
                "!Acorn is a popular methuselah pattern\n" +
                "!Which grows chaotically over thousands of generations \n"+ 
                ".........\n" +
                ".OO..OOO.\n" +
                "....O....\n" + 
                "..O......\n" +
                ".........\n"
            )).toEqual({
                format: "plaintext",
                name: "Acorn",
                description: [
                    "Acorn is a popular methuselah pattern",
                    "Which grows chaotically over thousands of generations"
                    ],
                matrix: [[0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 1, 1, 0, 0, 1, 1, 1, 0],
                [0, 0, 0, 0, 1, 0, 0, 0, 0],
                [0, 0, 1, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0]],
                liveCoordinates: [
                    [1, -1],
                    [2, -1],
                    [5, -1],
                    [6, -1],
                    [7, -1],
                    [4, -2],
                    [2, -3]
                ]
            })
        })

        it("Acorn w/ Name without Name: Identifier", () => {
            expect(readPlaintextString(
                "!Acorn\n" +
                "!Acorn is a popular methuselah pattern\n" +
                "!Which grows chaotically over thousands of generations \n"+ 
                ".........\n" +
                ".OO..OOO.\n" +
                "....O....\n" + 
                "..O......\n" +
                ".........\n"
            )).toEqual({
                format: "plaintext",
                name: "Acorn",
                description: [
                    "Acorn is a popular methuselah pattern",
                    "Which grows chaotically over thousands of generations"
                    ],
                matrix: [[0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 1, 1, 0, 0, 1, 1, 1, 0],
                [0, 0, 0, 0, 1, 0, 0, 0, 0],
                [0, 0, 1, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0]],
                liveCoordinates: [
                    [1, -1],
                    [2, -1],
                    [5, -1],
                    [6, -1],
                    [7, -1],
                    [4, -2],
                    [2, -3]
                ]
            })
        })

        it("Acorn w/ Description and Name Lines with spaces around exclamation", () => {
            expect(readPlaintextString(
                " !Acorn\n" +
                " !  Acorn is a popular methuselah pattern\n" +
                " ! Which grows chaotically over thousands of generations \n"+ 
                ".........\n" +
                ".OO..OOO.\n" +
                "....O....\n" + 
                "..O......\n" +
                ".........\n"
            )).toEqual({
                format: "plaintext",
                name: "Acorn",
                description: [
                    "Acorn is a popular methuselah pattern",
                    "Which grows chaotically over thousands of generations"
                    ],
                matrix: [[0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 1, 1, 0, 0, 1, 1, 1, 0],
                [0, 0, 0, 0, 1, 0, 0, 0, 0],
                [0, 0, 1, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0]],
                liveCoordinates: [
                    [1, -1],
                    [2, -1],
                    [5, -1],
                    [6, -1],
                    [7, -1],
                    [4, -2],
                    [2, -3]
                ]
            })
        })



    })
})

describe("write plain text matrix", () => {

    it("Acorn - No Description with empty string", () => {
        const acorn: (0 | 1)[][] = [[0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 1, 1, 0, 0, 1, 1, 1, 0],
        [0, 0, 0, 0, 1, 0, 0, 0, 0],
        [0, 0, 1, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0]]
    
        expect(writePlaintextString({
            matrix: acorn,
            name: "Acorn",
            description: "" 
        })).toEqual(
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
    
        expect(writePlaintextString({
            description: [],
            name: "Acorn",
            matrix: acorn
        })).toBe(
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

    
        expect(writePlaintextString({
            name: "Acorn",
            description: "A chaotic, classic pattern",
            matrix: acorn
        })).toBe(
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

        
    
        expect(writePlaintextString({
            name: "Acorn",
            description:  "A chaotic, classic pattern\nfound by Charles Corderman\nFinal bounding box of 215 by 168 cells",
            matrix: acorn
        })).toEqual(
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

        expect(writePlaintextString({ 
            name: "Acorn",
            description: ["A chaotic, classic pattern",
            "found by Charles Corderman",
            "Final bounding box of 215 by 168 cells"],
            matrix: acorn
        })).toEqual(
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

        expect(writePlaintextString({
            name: "Acorn",
            description: ["A chaotic, classic pattern\nThe most popular methuselah pattern",
            "found by Charles Corderman",
            "Final bounding box of 215 by 168 cells\nProduces 13 gliders"],
            matrix: acorn
        })).toBe(
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

    it("Acorn - Multi Line Description with string array and newlines", () => {
        const acorn: (0 | 1)[][] = [[0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 1, 1, 0, 0, 1, 1, 1, 0],
        [0, 0, 0, 0, 1, 0, 0, 0, 0],
        [0, 0, 1, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0]]

        expect(writePlaintextString({
            name: "Acorn",
            description: ["A chaotic, classic pattern\nThe most popular methuselah pattern",
            "found by Charles Corderman",
            "Final bounding box of 215 by 168 cells\nProduces 13 gliders"],
            matrix: acorn
        })).toEqual(
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

    describe("readPlaintextDiagramToXY", () => {

        expect(readPlaintextDiagramToXY(
            ".........\n" +
            ".OO..OOO.\n" +
            "....O....\n" + 
            "..O......\n" +
            ".........\n"
        )).toEqual([
            [1, -1],
            [2, -1],
            [5, -1],
            [6, -1],
            [7, -1],
            [4, -2],
            [2, -3]
        ])

    })

})

