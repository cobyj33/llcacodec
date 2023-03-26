// Life 1.05 File Format Spec: https://conwaylife.com/wiki/Life_1.05

import { uniqueNumberPairArray } from "core/set2D";
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

export interface Life105FileData {
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
            const [nextLine, nextRemainingStream] = readLine(currentRemainingStream)
            if (isNextChars(nextLine, "#P")) {
                break;
            }

            currentLine = nextLine
            currentRemainingStream = nextRemainingStream
        }

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

export function isLife105String(file: string): boolean {
    return file.trim().startsWith(LIFE_105_HEADER)
}

export function readLife105String(file: string): Life105FileData {
    file = file.replace("\r", "")

    const life105FileData: Life105FileData = {
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
        throw new Error("")
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
        } else if (id === "P") {
            break;
        }


        life105FileData.hashLines.push({
            id: id,
            content: trimmedContent,
            full: lines[currentLineIndex].trim()
        })

        currentLineIndex++
    }

    if (isNextChars(lines[currentLineIndex], "#P")) {
        const cellBlocksString = lines.slice(currentLineIndex).join("\n").trim()
        let remainingCellBlocksString = cellBlocksString

        while (remainingCellBlocksString.length > 0) {
            console.log(remainingCellBlocksString)
            try {
                const [cellBlock, remaining] = readLife105CellBlock(remainingCellBlocksString)
                console.log("Read cell block: ", cellBlock)
                console.log("Remaining: ", remaining)
                life105FileData.cellBlocks.push(cellBlock)
                life105FileData.liveCoordinates.push(...cellBlock.liveCoordinates)
                remainingCellBlocksString = remaining
            } catch (err) {
                break;
            }
        }
    }

    life105FileData.liveCoordinates = uniqueNumberPairArray(life105FileData.liveCoordinates)

    return life105FileData
}