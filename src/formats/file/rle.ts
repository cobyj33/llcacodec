import { isNextChar, isNextChars, readChar, readChars, readCrampedNumber, readNext, readNumber, readNumbers } from "../../core/strRead"
import { numberPairArrayToMatrix, isDigit, isStrictEqualStringArray, throws  } from "../../core/util"
import { LifeRuleData, readLifeRule, isValidLifeRule, CONWAY_RULE_STRING_BS, CONWAY_LIFE_RULE_DATA } from "../rule";

interface HashLine {
    id: string,
    content: string,
    full: string
}

export interface RLEFileData {
    comments: string[],
    name: string,
    topleft: [number, number] | null,
    width: number,
    height: number,
    ruleString: string,
    rule: LifeRuleData,
    liveCoordinates: [number, number][],
    hashLines: HashLine[],
    creationData: string
}

interface RLEFileHeaderData {
    width: number,
    height: number,
    ruleString: string | null,
    rule: LifeRuleData | null,
    full: string
}

const RLE_DEAD_CELL_CHAR = "b"
const RLE_LIVE_CELL_CHAR = "o"
const RLE_NEW_LINE_CHAR = "$"
const RLE_TERMINATION_CHAR = "!"
const DIGIT_DECIMAL_CHARACTERS = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"] as const
const RLE_VALID_CHARACTERS = [RLE_DEAD_CELL_CHAR, RLE_LIVE_CELL_CHAR, RLE_NEW_LINE_CHAR, RLE_TERMINATION_CHAR, ...DIGIT_DECIMAL_CHARACTERS, "\n", "\r"] as const

// --------------------------------------------------------------
// --------------------------------------------------------------
// --------------------------------------------------------------
// ------------------------- READING ----------------------------
// --------------------------------------------------------------
// --------------------------------------------------------------
// --------------------------------------------------------------



function isValidRLEDataCharacter(char: string): boolean {
    return RLE_VALID_CHARACTERS.some(validChar => validChar === char)
}

interface ParsedRLEData {
    liveCoordinates: [number, number][],
    pattern: string,
    endingIndex: number,
    readonly topleft: [number, number]
}

/**
 * Must start 
 * 
 * Must end with ! or have no more data at the end at the end (please end your RLE data with a !)
 * 
 * @param rleData 
 */
export function readRLEData(rlePattern: string, topleft: [number, number] = [0, 0]): ParsedRLEData {
    let i = 0;
    let currRun: string[] = []

    const rleData: ParsedRLEData = {
        liveCoordinates: [],
        pattern: "",
        endingIndex: 0,
        topleft: [...topleft] 
    }

    let currCoordinate: [number, number] = [...topleft]

    while (isValidRLEDataCharacter(rlePattern[i]) && i < rlePattern.length) {

        if (rlePattern[i] === RLE_TERMINATION_CHAR) {
            rleData.pattern = rlePattern.substring(0, i)
            rleData.endingIndex = i;
            return rleData;
        } else if (isDigit(rlePattern[i])) {
            currRun.push(rlePattern[i])
        } else if (rlePattern[i] === RLE_LIVE_CELL_CHAR || rlePattern[i] === RLE_DEAD_CELL_CHAR) {
            const runLength = currRun.length === 0 ? 1 : Number.parseInt(currRun.join(""))
            currRun = []
            if (isNaN(runLength)) {
                throw new Error("")
            }

            if (rlePattern[i] === RLE_LIVE_CELL_CHAR) {
                for (let j = 0; j < runLength; j++) {
                    rleData.liveCoordinates.push([...currCoordinate])
                    currCoordinate[0]++;
                }
            } else if (rlePattern[i] === RLE_DEAD_CELL_CHAR) {
                currCoordinate[0] += runLength;
            }

        } else if (rlePattern[i] === RLE_NEW_LINE_CHAR) {
            const runLength = currRun.length === 0 ? 1 : Number.parseInt(currRun.join(""))
            currRun = []
            currCoordinate[0] = topleft[0]
            currCoordinate[1] -= runLength;
        }

        i++;
    }

    if (i === rlePattern.length - 1) {
        rleData.pattern = rlePattern
        rleData.endingIndex = rlePattern.length - 1
        return rleData;
    }

    throw new Error(`Unexpected ending to RLE Data. Ended at char (${rlePattern[i]} at index ${i} of ${rlePattern.length})`)
}

export function readRLEStringHeader(headerLine: string): RLEFileHeaderData {
    const trimmed = headerLine.trim();

    const ruleFileHeaderData: RLEFileHeaderData = {
        width: 0,
        height: 0,
        ruleString: null,
        rule: null,
        full: trimmed
    }

    const [, afterXEquals] = readChars(trimmed, "x=")
    const [width, afterWidth] = readCrampedNumber(afterXEquals)
    ruleFileHeaderData.width = width

    const [, afterYEquals] = readChars(afterWidth, ",y=")
    const [height, afterHeight] = readCrampedNumber(afterYEquals)
    ruleFileHeaderData.height = height

    if (isNextChars(afterHeight, ",rule=")) {
        const [, afterRule] = readChars(afterHeight, ",rule=")
        const [rule, end] = readNext(afterRule)
        if (isValidLifeRule(rule)) {
            ruleFileHeaderData.rule = readLifeRule(rule)
            ruleFileHeaderData.ruleString = rule;
        } else {
            throw new Error(`Invalid Rule found in RLE Data while parsing RLE Header Line: "${rule}" ( passed in "${headerLine}") `)
        }
    }

    return ruleFileHeaderData
}

export function isRLEString(file: string): boolean {
    const lines = file.trim().split("\n")
    for (let i = 0; i < lines.length; i++) {
        if (!lines[i].trim().startsWith("#") && i < lines.length - 1) {
            return !throws(() => readRLEStringHeader(lines[i + 1].trim()))
        }
    }

    return false;
}


export function readRLEString(file: string): RLEFileData {
    const lines = file.trim().split("\n")
    let currentLine = 0;

    const rleFileData: RLEFileData = {
        comments: [],
        name: "",
        creationData: "",
        topleft: null,
        width: 0,
        height: 0,
        ruleString: CONWAY_RULE_STRING_BS,
        rule: CONWAY_LIFE_RULE_DATA(),
        liveCoordinates: [],
        hashLines: []
    }
    
    //commented lines
    while (isNextChar(lines[currentLine], "#")) {
        const [, afterHashTag] = readChar(lines[currentLine], "#")
        const [id, afterID] = readChar(afterHashTag)
        const content = afterID.trim()

        if (content.length > 0) {

            if (id === "C" || id === "c") {
                rleFileData.comments.push(content)
            } else if (id === "N") {
                rleFileData.name = content
            } else if (id === "O") {
                rleFileData.creationData = content
            } else if (id === "P" || id === "R") {
                const [[x, y]] = readNumbers(afterID, 2)
                rleFileData.topleft = [x, y]
            } else if (id === "r") {
                rleFileData.ruleString = content
                rleFileData.rule = readLifeRule(content)
            }

        }

        rleFileData.hashLines.push({
            content: afterID.trim(),
            id: id,
            full: lines[currentLine].trim()
        })

        currentLine++;
    }

    //header line
    const headerLineData = readRLEStringHeader(lines[currentLine])
    rleFileData.width = headerLineData.width;
    rleFileData.height = headerLineData.height
    if (headerLineData.ruleString !== null && headerLineData.rule !== null) {
        rleFileData.rule = headerLineData.rule
        rleFileData.ruleString = headerLineData.ruleString
    }
    
    //rle encoded data
    
    currentLine++;
    const afterHeader = lines.slice(currentLine).join("\n") 
    const data = readRLEData(afterHeader, rleFileData.topleft !== null ? rleFileData.topleft : [0, 0])

    rleFileData.liveCoordinates = data.liveCoordinates
    if (data.endingIndex + 1 !== afterHeader.length - 1) {
        const afterRLEData = afterHeader.substring(data.endingIndex + 1)
        const linesAfterRLEData = afterRLEData.split("\n")
        rleFileData.comments.push(...linesAfterRLEData.map(line => line.trim()).filter(line => line.length > 0))
    }


    //Everything after this is considered a comment

    return rleFileData
}


// --------------------------------------------------------------
// --------------------------------------------------------------
// --------------------------------------------------------------
// ------------------------- WRITING ----------------------------
// --------------------------------------------------------------
// --------------------------------------------------------------
// --------------------------------------------------------------

