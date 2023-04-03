import { trimTrailing, numberPairArrayToMatrix, isStringArray, isCellMatrix, isCellCoordinateArray } from "../../core/util";
import { isNextChar, isNextChars, readChar, readChars } from "../../core/strRead"

const VALID_DEAD_CELL_CHARACTERS = ["."] as const;
const VALID_LIVE_CELL_CHARACTERS = ["O", "*"] as const;

export interface PlaintextDecodedData {
    format: "plaintext"
    name: string
    description: string[]
    matrix: (0 | 1)[][]
    liveCoordinates: [number, number][]
}

export interface PlaintextMatrixWriteData {
    name: string,
    description: string | string[]
    matrix: (0 | 1)[][]
}

export function isPlaintextMatrixWriteData(data: unknown): data is PlaintextMatrixWriteData {
    return typeof(data) === "object" && data !== null &&
    "name" in data && "description" in data && "matrix" in data &&
    typeof(data.name) === "string" && (typeof(data.description) === "string" || isStringArray(data.description)) &&
    isCellMatrix(data.matrix)
}

export interface PlaintextCoordinateWriteData {
    name: string,
    description: string | string[]
    liveCoordinates: [number, number][]
}

export function isPlaintextCoordinateWriteData(data: unknown): data is PlaintextCoordinateWriteData {
    return typeof(data) === "object" && data !== null &&
    "name" in data && "description" in data && "liveCoordinates" in data &&
    typeof(data.name) === "string" && (typeof(data.description) === "string" || isStringArray(data.description)) &&
    isCellCoordinateArray(data.liveCoordinates)
}

// --------------------------------------------------------------
// --------------------------------------------------------------
// --------------------------------------------------------------
// ------------------------- WRITING ----------------------------
// --------------------------------------------------------------
// --------------------------------------------------------------
// --------------------------------------------------------------

export function writePlaintextString(data: PlaintextMatrixWriteData | PlaintextCoordinateWriteData): string {
    let matrix: (0 | 1)[][] = [];
    if ("matrix" in data) {
        matrix = data.matrix;
    } else {
        for (let i = 0; i < data.liveCoordinates.length; i++) {
            if (!Number.isInteger(data.liveCoordinates[i][0]) || !Number.isInteger(data.liveCoordinates[i][1])) {
                throw new Error(`Attempted to write plain text with Invalid Coordinates: Coordinates must all be integers (Error at coordinate #${i} x: ${data.liveCoordinates[i][0]} y: ${data.liveCoordinates[i][1]} `)
            }
        }
        matrix = numberPairArrayToMatrix(data.liveCoordinates);
    }

    const builder: string[] = []
    builder.push("!Name: " + data.name + "\n")
    if (data.description.length > 0) {
        if (typeof(data.description) === "string") {
                const lines = data.description.replace("\r", "").split("\n")
                lines.forEach(line => builder.push(`!${line}\n`))
        } else {
            const lines = data.description.flatMap(lines => lines.split("\n"))
            lines.forEach(line => builder.push(`!${line}\n`))
        }
    }
    builder.push("!\n")
    
    const height = matrix.length;
    const width = Math.max(...matrix.map(row => row.length))
    for (let row = 0; row < height; row++) {
        for (let col = 0; col < width; col++) {
            if (col >= matrix[row].length) {
                builder.push(".")
            } else {
                builder.push(matrix[row][col] === 0 ? "." : "O")
            }
        }
        builder.push("\n")
    }

    return builder.join("")
}

// --------------------------------------------------------------
// --------------------------------------------------------------
// --------------------------------------------------------------
// ------------------------- READING ----------------------------
// --------------------------------------------------------------
// --------------------------------------------------------------
// --------------------------------------------------------------


export function isPlaintextString(str: string): boolean {
    try {
        readPlaintextString(str);
        return true;
    } catch (e) {
        return false;
    }
}

export function readPlaintextString(str: string): PlaintextDecodedData {
    if (str.length === 0) {
        throw new Error(`[llcacodec] Attempted to pass in empty string toward Plain Text Decoder`)
    }
    
    const lines = str.replace("\r", "").split("\n").map(line => line.trim())
    if (lines.length === 0) {
        throw new Error(`[llcacodec] Could not find any unique lines in plain text string "${str}"`)
    }
    
    const contents: PlaintextDecodedData = {
        format: "plaintext",
        name: "",
        description: [],
        matrix: [],
        liveCoordinates: []
    }
    

    //reads header line
    if (isNextChar(lines[0], "!")) {
        const [, afterHeaderExclamation] = readChar(lines[0], "!")
        if (isNextChars(afterHeaderExclamation, "Name:")) {
            const [, afterNameDeclaration] = readChars(afterHeaderExclamation, "Name:")
            contents.name = afterNameDeclaration.trim();
        } else {
            contents.name = afterHeaderExclamation.trim()
        }
    } else {
        const trimmedStr = str.trim();
        if (isPlaintextDiagram(trimmedStr)) {
            return {
                format: "plaintext",
                name: "",
                description: [],
                matrix: readPlaintextDiagramToMatrix(trimmedStr),
                liveCoordinates: readPlaintextDiagramToXY(trimmedStr)
            }
        }
        throw new Error(`[llcacodec::readPlaintextString] attempted to read invalid plain text string ${str}. ${str} could neither be determined to be a plaintext string nor a plaintext diagram`)
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
    if (isPlaintextDiagram(diagramLines)) {
        contents.liveCoordinates = readPlaintextDiagramToXY(diagramLines)
        contents.matrix = readPlaintextDiagramToMatrix(diagramLines);
    } else {
        throw new Error(`[llcacodec::readPlaintextString could not read final section of Plaintext string as Plaintext diagram]`)
    }
    return contents
}

export function readPlaintextDiagramToXY(str: string): [number, number][] {
    if (!isPlaintextDiagram(str)) {
        throw new Error(`[llcacodec::readPlaintextDiagramToXY] attempted to read invalid plaintext diagram ${str}`)
    }

    const lines = str.split("\n")
    return lines.flatMap((line, row) => 
        line.split("").map((char, col) => VALID_LIVE_CELL_CHARACTERS.some(valid => valid === char) ? [col, -row] : []).filter(point => point.length > 0) as [number, number][]
    )
}

export function readPlaintextDiagramToMatrix(str: string): (0 | 1)[][] {
    if (!isPlaintextDiagram(str)) {
        throw new Error(`[llcacodec::readPlaintextDiagramToXY] attempted to read invalid plaintext diagram ${str}`)
    }

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


export function isPlaintextDiagram(line: string): boolean {
    return line.split("").every(char => VALID_DEAD_CELL_CHARACTERS.some(ch => ch === char) || VALID_LIVE_CELL_CHARACTERS.some(ch => ch === char) || char === " " || char === "\n");
}