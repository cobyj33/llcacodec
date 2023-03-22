import { pushASCIIBytes, byteArrayAsASCII, trimTrailing, numberPairArrayToMatrix } from "../../core/util";
import { isNextChar, isNextSeq, readChar, readSeq } from "../../core/strRead"

const VALID_DEAD_CELL_CHARACTERS = ["."] as const;
const VALID_LIVE_CELL_CHARACTERS = ["O", "*"] as const;


export interface PlainTextStringDecodedContents {
    name: string
    description: string[]
    matrix: (0 | 1)[][]
    cellCoordinates: [number, number][]
}

function writePlainTextMetadata(byteArray: number[], name: string, description: string | string[]): number[] {
    const newArray: number[] = [...byteArray]
    pushASCIIBytes(newArray, "!Name: " + name + "\n")
    if (description.length > 0) {
        if (typeof(description) === "string") {
                const lines = description.split("\n")
                lines.forEach(line => pushASCIIBytes(newArray, `!${line}\n`))
        } else {
            const lines = description.flatMap(lines => lines.split("\n"))
            lines.forEach(line => pushASCIIBytes(newArray, `!${line}\n`))
        }
    }

    pushASCIIBytes(newArray, "!\n")
    return newArray
}

export function readPlainTextDiagramToXYCoordinates(str: string): [number, number][] {
    if (isPlainTextDiagram(str)) {
        const lines = str.split("\n")
        return lines.flatMap((line, row) => 
            line.split("").map((char, col) => VALID_LIVE_CELL_CHARACTERS.some(valid => valid === char) ? [col, -row] : []).filter(point => point.length > 0) as [number, number][]
        )
    }

    throw new Error("error")
}

export function readPlainTextDiagramToMatrix(str: string): (0 | 1)[][] {
    if (isPlainTextDiagram(str)) {
        const lines = trimTrailing(str, "\n").split("\n")
        const width = Math.max(...lines.map(line => line.length))
        return lines.map(line => {
            const newLine = new Array<0 | 1>(width)
            for (let i = 0; i < width; i++) {
                if (i >= line.length) {
                    newLine[i] = 0;
                } else if (VALID_LIVE_CELL_CHARACTERS.some(ch => ch === line[i])) {
                    newLine[i] = 1
                } else if (VALID_DEAD_CELL_CHARACTERS.some(ch => ch === line[i])) {
                    newLine[i] = 0
                } else if (line[i] !== " ") {
                    throw new Error()
                }
            }
            return newLine
        })


    }
    throw new Error("")

}


export function readPlainTextDiagramToRowColCoordinates(str: string): [number, number][] {
    const coordinates = readPlainTextDiagramToXYCoordinates(str);
    return coordinates.map(coord => ([coord[0], -coord[1]]))
}

export function writePlainTextFromCoordinates(positions: [number, number][], name: string, description: string | string[]): string {
    for (let i = 0; i < positions.length; i++) {
        if (!Number.isInteger(positions[i][0]) || !Number.isInteger(positions[i][1])) {
            throw new Error(`Attempted to write plain text with Invalid Coordinates: Coordinates must all be integers (Error at coordinate #${i} x: ${positions[i][0]} y: ${positions[i][1]} `)
        }
    }

    return writePlainTextMatrix(numberPairArrayToMatrix(positions) as (0 | 1)[][], name, description)    
}

export function writePlainTextMatrix(data: (0 | 1)[][], name: string, description: string | string[]): string {
    const byteArray = writePlainTextMetadata([], name, description)

    const height = data.length;
    const width = Math.max(...data.map(row => row.length))

    for (let row = 0; row < height; row++) {
        for (let col = 0; col < width; col++) {
            if (col >= data[row].length) {
                pushASCIIBytes(byteArray, ".")
            } else {
                pushASCIIBytes(byteArray, data[row][col] === 0 ? "." : "O")
            }
        }
        pushASCIIBytes(byteArray, "\n")
    }

    return byteArrayAsASCII(byteArray)
}




export function isPlainTextString(str: string): boolean {
    try {
        readPlainTextString(str);
        return true;
    } catch (e) {
        return false;
    }
}

export function readPlainTextString(str: string): PlainTextStringDecodedContents {
    if (str.length === 0) {
        throw new Error("")
    }
    
    const lines = str.split("\n").map(line => line.trim())
    if (lines.length === 0) {
        throw new Error("")
    }
    
    const contents: PlainTextStringDecodedContents = {
        name: "",
        description: [],
        matrix: [],
        cellCoordinates: []
    }
    

    //reads header line
    if (isNextChar(lines[0], "!")) {
        const [, afterHeaderExclamation] = readChar(lines[0], "!")
        if (isNextSeq(afterHeaderExclamation, "Name:")) {
            contents.name = readSeq(afterHeaderExclamation, "Name:")[1].trim();
        } else {
            contents.name = afterHeaderExclamation.trim()
        }
    } else {
        const trimmedStr = str.trim();
        if (isPlainTextDiagram(trimmedStr)) {
            return {
                name: "",
                description: [],
                matrix: readPlainTextDiagramToMatrix(trimmedStr),
                cellCoordinates: readPlainTextDiagramToXYCoordinates(trimmedStr)
            }
        }
        throw new Error("")
    }

    //reading description lines
    let currentLine = 1;
    while (isNextChar(lines[currentLine], "!")) {
        const [, description] = readChar(lines[currentLine], "!")
        if (description.trim().length > 0) {
            contents.description.push(description.trim())
        }
        currentLine++;
    }

    const diagramLines = lines.slice(currentLine).join("\n")
    if (isPlainTextDiagram(diagramLines)) {
        contents.cellCoordinates = readPlainTextDiagramToXYCoordinates(diagramLines)
        contents.matrix = readPlainTextDiagramToMatrix(diagramLines);
    } else {
        throw new Error("")
    }
    return contents
}

export function isPlainTextDiagram(line: string): boolean {
    return line.split("").every(char => VALID_DEAD_CELL_CHARACTERS.some(ch => ch === char) || VALID_LIVE_CELL_CHARACTERS.some(ch => ch === char) || char === " " || char === "\n");
}