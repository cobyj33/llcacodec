import { ByteArray } from "../core/byteArray"
import { numberPairArrayToMatrix } from "../core/util"
import { StringStream } from "../core/stringStream"

function writePlainTextMetadata(byteArray: ByteArray, name: string, description: string | string[]): void {
    byteArray.writeUTFBytes("!Name: " + name + "\n")
    if (description.length > 0) {
        if (typeof(description) === "string") {
                const lines = description.split("\n")
                lines.forEach(line => byteArray.writeUTFBytes(`!${line}\n`))
        } else {
            const lines = description.flatMap(lines => lines.split("\n"))
            lines.forEach(line => byteArray.writeUTFBytes(`!${line}\n`))
        }
    }

    byteArray.writeUTFBytes("!\n")
}

export function readPlainTextDiagramToXYCoordinates(str: string): [number, number][] {
    const lines = str.split("\n")
    let currentLine = 0;
    const cellCoordinates: [number, number][] = []
    while (isPlainTextDiagramLine(lines[currentLine])) {
        const row = readPlainTextDiagramLine(lines[currentLine])
        for (let i = 0; i < row.length; i++) {
            if (row[i] === 1) {
                cellCoordinates.push([i, -currentLine])
            }
        }
        currentLine++;

        if (currentLine === lines.length) {
            return cellCoordinates;
        }
    }

    throw new Error("error")
}

export function readPlainTextDiagramToMatrix(str: string): (0 | 1)[][] {
    const coordinates = readPlainTextDiagramToXYCoordinates(str);
    return numberPairArrayToMatrix(coordinates);
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
    const byteArray = new ByteArray();
    writePlainTextMetadata(byteArray, name, description)

    const height = data.length;
    const width = Math.max(...data.map(row => row.length))

    for (let row = 0; row < height; row++) {
        for (let col = 0; col < width; col++) {
            if (col >= data[row].length) {
                byteArray.writeUTFBytes(".");
            } else {
                byteArray.writeUTFBytes(data[row][col] === 0 ? "." : "O");
            }
        }
        byteArray.writeUTFBytes("\n")
    }

    return byteArray.getString();
}


interface PlainTextStringDecodedContents {
    name: string
    description: string[]
    matrix: (0 | 1)[][]
    cellCoordinates: [number, number][]
}

const VALID_DEAD_CELL_CHARACTERS = ["."] as const;
const VALID_LIVE_CELL_CHARACTERS = ["O", "*"] as const;

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

    if (isPlainTextHeaderLine(lines[0])) {
        contents.name = readPlainTextHeaderLine(lines[0])
    }

    let currentLine = 1;
    while (isPlainTextDescriptionLine(lines[currentLine])) {
        contents.description.push(readPlainTextDescriptionLine(lines[currentLine]))
        currentLine++;
        if (currentLine >= lines.length) {
            throw new Error()
        }
    }

    const diagramStart = currentLine;
    contents.cellCoordinates = readPlainTextDiagramToXYCoordinates(lines.slice(currentLine).join("\n"))
    contents.matrix = numberPairArrayToMatrix(contents.cellCoordinates);
    return contents
}

function isPlainTextHeaderLine(headerLine: string) {
    return isPlainTextDescriptionLine(headerLine)
}

function readPlainTextHeaderLine(headerLine: string): string {
    const stringstream: StringStream = new StringStream(headerLine)
    const exclamation = stringstream.readNextNotWhiteSpaceChar()
    if (stringstream.isFinished()) {
        throw new Error()
    }
    if (exclamation !== "!") {
        throw new Error()
    }

    const nameDeclaration = stringstream.readNextNotWhiteSpaceSection();
    if (nameDeclaration === "Name:") {
        stringstream.advance();
        const name = stringstream.readLine().trimStart();
        return name;
    } else {
        const restOfName = stringstream.readLine();
        return nameDeclaration + restOfName
    }
}

function isPlainTextDescriptionLine(line: string): boolean {
    const stringstream = new StringStream(line);
    const exclamation = stringstream.readNextNotWhiteSpaceChar()
    if (stringstream.isFinished()) {
        return false;
    }
    if (exclamation !== "!") {
        return false;
    }

    return true;
}

function readPlainTextDescriptionLine(line: string): string {
    const stringstream = new StringStream(line);
    const exclamation = stringstream.readNextNotWhiteSpaceChar()
    if (stringstream.isFinished()) {
        throw new Error()
    }
    if (exclamation !== "!") {
        throw new Error()
    }

    return stringstream.readLine().trimStart();
}

function isPlainTextDiagramLine(line: string): boolean {
    return line.split("").every(char => VALID_DEAD_CELL_CHARACTERS.some(ch => ch === char) || VALID_LIVE_CELL_CHARACTERS.some(ch => ch === char) || char === " ");
}

function readPlainTextDiagramLine(line: string): (0 | 1)[] {
    const row: Array<0 | 1> = []
    for (let i = 0; i < line.length; i++) {
        if (!(VALID_DEAD_CELL_CHARACTERS.some(ch => ch === line[i]) || VALID_LIVE_CELL_CHARACTERS.some(ch => ch === line[i]) || line[i] === " ")) {
            throw new Error()
        }
        if (VALID_LIVE_CELL_CHARACTERS.some(ch => ch === line[i])) {
            row.push(1)
        }
        if (VALID_DEAD_CELL_CHARACTERS.some(ch => ch === line[i])) {
            row.push(0)
        }
    }

    return row;
}