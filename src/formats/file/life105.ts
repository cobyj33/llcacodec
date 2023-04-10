// Life 1.05 File Format Spec: https://conwaylife.com/wiki/Life_1.05

import { numberPairArrayToMatrix, uniqueNumberPairArray } from "../../core/util";
import { isNextChar, isNextChars, readChar, readChars, readIntegers, readLine } from "../../core/strRead";
import { CONWAY_LIFE_RULE_DATA, CONWAY_RULE_STRING_SB, readLifeRule } from "../rule";

const LIFE_105_HEADER = "#Life 1.05" as const
const MAX_DESCRIPTION_LINE_COUNT = 22
const LIFE_105_MAX_LINE_LENGTH = 80

const Life105FileExtensions = [".lif", ".life"] as const;

type LifeRuleData = { birth: number[], survival: number[] }

interface Life105Config {
  descriptions: string | string[],
  rule: string | LifeRuleData | number | "N#"
}

interface HashLine {
    id: string,
    content: string,
    full: string
}

interface Life105CellBlock {
    x: number,
    y: number,
    width: number,
    height: number,
    pattern: (0 | 1)[][]
    liveCoordinates: [number, number][]
}

export interface Life105DecodedData {
    format: "life 1.05"
    cellBlocks: Life105CellBlock[]
    liveCoordinates: [number, number][]
    descriptions: string[],
    rule: string | null,
    parsedRule: LifeRuleData | null,
    hashLines: HashLine[]
}

const LIFE_105_DEAD_CHAR = "."
const LIFE_105_ALIVE_CHAR = "*"

function isLife105CellBlock(data: string): boolean {
    if (!isNextChars(data, "#P")) {
        return false;
    }
    const [pointLine, afterPointLine] = readLine(data)
    const [, afterPointDeclaration] = readChars(pointLine, "#P")

    const [[x, y]] = readIntegers(afterPointDeclaration, 2)
    
    const trimmedPatternLines = afterPointLine.split("\n").map(line => line.trim())
    for (let i = 0; i < trimmedPatternLines.length; i++) {
        for (let j = 0; j < trimmedPatternLines[i].length; j++) {
            if ( !( trimmedPatternLines[i][j] === LIFE_105_DEAD_CHAR || trimmedPatternLines[i][j] === LIFE_105_ALIVE_CHAR ) ) {
                return false;
            }
        }
    }

    return true;
}

function readLife105CellBlock(data: string): Life105CellBlock {
    const trimmedLines = data.split("\n").map(line => line.trim())
    const pointLine = trimmedLines[0]
    const [, afterPointDeclaration] = readChars(pointLine, "#P")
    const [[x, readY]] = readIntegers(afterPointDeclaration, 2)
    const y = -readY; // positive y is down for life 1.05, so I flip it for compatibility with llcacodec where positive y is up

    let i = 1;
    const liveCoordinates: [number, number][] = []
    while (i < trimmedLines.length && !isNextChars(trimmedLines[i], "#P")) {
        for (let j = 0; j < trimmedLines[i].length; j++) {
            if (trimmedLines[i][j] === LIFE_105_ALIVE_CHAR) {
                liveCoordinates.push([x + j,  y - (i - 1)]) 
            } 
        }
        i++;
    }

    const matrix = numberPairArrayToMatrix(liveCoordinates)

    return {
        x: x,
        y: y,
        width: matrix.length !== 0 ? matrix[0].length : 0,
        height: matrix.length,
        pattern: matrix,
        liveCoordinates: liveCoordinates
    }
}

function extractLife105CellBlockStrings(data: string): string[] {
    const lines = data.trim().split("\n")
    const cellBlockStrings: string[] = [];

    let cellBlockStart = -1;
    for (let i = 0; i < lines.length; i++) {
        if (isNextChars(lines[i].trim(), "#P")) {
            if (cellBlockStart !== -1) {
                cellBlockStrings.push(lines.slice(cellBlockStart, i).join("\n"));
            }
            cellBlockStart = i;
        }
    }

    if (cellBlockStart !== -1) {
        cellBlockStrings.push(lines.slice(cellBlockStart, lines.length).join("\n"));
    }

    return cellBlockStrings
}
 
export function isLife105String(file: string): boolean {
    return file.trim().startsWith(LIFE_105_HEADER)
}

export function readLife105String(file: string): Life105DecodedData {
    file = file.replace("\r", "")

    const life105StringData: Life105DecodedData = {
        format: "life 1.05",
        cellBlocks: [],
        liveCoordinates: [],
        descriptions: [],
        rule: null,
        parsedRule: null,
        hashLines: []
    }

    const lines = file.split("\n")
    const headerLine = lines[0]
    if (!headerLine.trim().startsWith(LIFE_105_HEADER)) {
        throw new Error(`[llcacodec::readLife105String given Life105String does not begin with the required Life 1.05 header "#Life 1.05"]`)
    }

    let currentLineIndex = 1;

    while (isNextChar(lines[currentLineIndex], "#")) {
        const [, afterHash] = readChar(lines[currentLineIndex], "#")
        const [id, afterID] = readChar(afterHash)
        const trimmedContent = afterID.trim();

        if (id === "D") {
            life105StringData.descriptions.push(trimmedContent)
        } else if (id === "R") {
            life105StringData.rule = trimmedContent
            life105StringData.parsedRule = readLifeRule(trimmedContent)
        } else if (id === "N") {
            life105StringData.rule = CONWAY_RULE_STRING_SB
            life105StringData.parsedRule = CONWAY_LIFE_RULE_DATA()
        } else if (id === "P") { // encountered beginning of Cell Block Data
            break;
        }

        life105StringData.hashLines.push({
            id: id,
            content: trimmedContent,
            full: lines[currentLineIndex].trim()
        })

        currentLineIndex++
    }

    const cellBlockStrings: string[] = extractLife105CellBlockStrings(lines.slice(currentLineIndex).join("\n"));

    for (let i = 0; i < cellBlockStrings.length; i++) {
        const cellBlock = readLife105CellBlock(cellBlockStrings[i])
        life105StringData.cellBlocks.push(cellBlock)
        life105StringData.liveCoordinates.push(...cellBlock.liveCoordinates)
    }

    life105StringData.liveCoordinates = uniqueNumberPairArray(life105StringData.liveCoordinates)

    return life105StringData
}