// Life 1.05 File Format Spec: https://conwaylife.com/wiki/Life_1.05

import { uniqueNumberPairArray } from "../../core/util";
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
    ruleString: string | null,
    rule: LifeRuleData | null,
    hashLines: HashLine[]
}

const LIFE_105_DEAD_CHAR = "."
const LIFE_105_ALIVE_CHAR = "*"

function readLife105CellBlock(data: string): [Life105CellBlock, string] {
    data = data.trim();
    if (isNextChars(data, "#P")) {
        const cellBlock: Life105CellBlock = {
            x: 0,
            y: 0,
            width: 0,
            height: 0,
            pattern: [],
            liveCoordinates: []
        }

        const [pointLine, afterPointLine] = readLine(data)
        const [, afterPointDeclaration] = readChars(pointLine, "#P")
        const [[x, y]] = readIntegers(afterPointDeclaration, 2)
        cellBlock.x = x;
        cellBlock.y = y;
        
        let [currentLine, currentRemainingStream] = readLine(afterPointLine);
        currentLine = currentLine.trim();
        while (!isNextChars(currentLine, "#P") || currentLine.length === 0) { // exits when the next #P line is hit

            if (currentLine.length === 0) {
                if (currentRemainingStream.trim().length === 0) {
                    break;
                }
                const [nextLine, nextRemainingStream] = readLine(currentRemainingStream)
                if (isNextChars(nextLine, "#P")) {
                    break;
                }
                currentLine = nextLine
                currentRemainingStream = nextRemainingStream
                continue;
            }

            cellBlock.width = Math.max(cellBlock.width, currentLine.length)
            const row = new Array<0 | 1>(cellBlock.width).fill(0);
            for (let i = 0; i < cellBlock.width; i++) {
                if (i < currentLine.length && currentLine[i] === LIFE_105_ALIVE_CHAR) {
                    row[i] = 1
                    cellBlock.liveCoordinates.push([x + i, y - cellBlock.pattern.length])
                }
            }
            cellBlock.pattern.push(row)

            if (currentRemainingStream.trim().length === 0) {
                break;
            }
            const [nextLine, nextRemainingStream] = readLine(currentRemainingStream)
            if (isNextChars(nextLine, "#P")) {
                break;
            }

            currentLine = nextLine
            currentRemainingStream = nextRemainingStream
        }
        console.log("Current Line Exited: ", currentLine)

        cellBlock.height = cellBlock.pattern.length;

        for (let i = 0; i < cellBlock.height; i++) { // Correct all pattern rows to be the same size
            if (cellBlock.pattern[i].length < cellBlock.width) {
                cellBlock.pattern[i].push(...new Array<0>(cellBlock.width - cellBlock.pattern[i].length).fill(0))
            }
        }

        return [cellBlock, currentRemainingStream]
    } else {
        throw new Error(`Cannot read next Life 105 Cell Block, not positioned correctly. Must have "#P" next in the stream`)
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

    const life105FileData: Life105DecodedData = {
        format: "life 1.05",
        cellBlocks: [],
        liveCoordinates: [],
        descriptions: [],
        ruleString: CONWAY_RULE_STRING_SB,
        rule: CONWAY_LIFE_RULE_DATA(),
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
            life105FileData.descriptions.push(trimmedContent)
        } else if (id === "R") {
            life105FileData.ruleString = trimmedContent
            life105FileData.rule = readLifeRule(trimmedContent)
        } else if (id === "N") {
            life105FileData.ruleString = CONWAY_RULE_STRING_SB
            life105FileData.rule = CONWAY_LIFE_RULE_DATA()
        } else if (id === "P") { // encountered beginning of Cell Block Data
            break;
        }

        life105FileData.hashLines.push({
            id: id,
            content: trimmedContent,
            full: lines[currentLineIndex].trim()
        })

        currentLineIndex++
    }

    const cellBlockStrings: string[] = extractLife105CellBlockStrings(lines.slice(currentLineIndex).join("\n"));

    for (let i = 0; i < cellBlockStrings.length; i++) {
        const [cellBlock] = readLife105CellBlock(cellBlockStrings[i])
        life105FileData.cellBlocks.push(cellBlock)
        life105FileData.liveCoordinates.push(...cellBlock.liveCoordinates)
    }

    // if (isNextChars(lines[currentLineIndex], "#P")) {
    //     const cellBlocksString = lines.slice(currentLineIndex).join("\n").trim()
    //     let remainingCellBlocksString = cellBlocksString

    //     while (remainingCellBlocksString.length > 0 && isNextChars(remainingCellBlocksString, "#P")) {
    //         const [cellBlock, remaining] = readLife105CellBlock(remainingCellBlocksString)
    //         life105FileData.cellBlocks.push(cellBlock)
    //         life105FileData.liveCoordinates.push(...cellBlock.liveCoordinates)
    //         remainingCellBlocksString = remaining
    //     }
    // } else {
    //     throw new Error(`[llcacodec::readLife105String given Life105String does not contain Cell Block data directly after hashed comments]`)
    // }

    life105FileData.liveCoordinates = uniqueNumberPairArray(life105FileData.liveCoordinates)

    return life105FileData
}

// function writeLife105String()