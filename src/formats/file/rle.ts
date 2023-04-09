import { isNextChar, isNextChars, readChar, readChars, readCrampedNumber, readNext, readNumbers } from "../../core/strRead"
import { isDigit, throws, getCellBoundingBox, numberPairArrayToMatrix  } from "../../core/util"
import { LifeRuleData, readLifeRule, isValidLifeRule, CONWAY_RULE_STRING_BS, CONWAY_LIFE_RULE_DATA, makeLifeRule, convertLifeRule } from "../rule";

interface HashLine {
    id: string,
    content: string,
    full: string
}

export interface RLEDecodedData {
    format: "rle"
    comments: string[],
    name: string,
    topleft: [number, number],
    foundTopLeft: boolean,
    width: number,
    height: number,
    ruleString: string,
    rule: LifeRuleData,
    liveCoordinates: [number, number][],
    hashLines: HashLine[],
    creationData: string
}

interface RLEHeaderDecodedData {
    width: number,
    height: number,
    ruleString: string | null,
    rule: LifeRuleData | null,
    full: string
}

interface RLECommonEncodingData {
    name?: string,
    rule?: string | number | LifeRuleData,
    comments?: string[],
    creationData?: string,
}

export interface RLEMatrixEncodingData extends RLECommonEncodingData {
    topleft: [number, number]
    matrix: (0 | 1)[][],
}

export interface RLECoordinateEncodingData extends RLECommonEncodingData {
    liveCoordinates: [number, number][]
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

export function readRLEStringHeader(headerLine: string): RLEHeaderDecodedData {
    const trimmed = headerLine.trim();

    const rleFileHeaderData: RLEHeaderDecodedData = {
        width: 0,
        height: 0,
        ruleString: null,
        rule: null,
        full: trimmed
    }

    const [, afterXEquals] = readChars(trimmed, "x=")
    const [width, afterWidth] = readCrampedNumber(afterXEquals)
    rleFileHeaderData.width = width

    const [, afterYEquals] = readChars(afterWidth, ",y=")
    const [height, afterHeight] = readCrampedNumber(afterYEquals)
    rleFileHeaderData.height = height

    if (isNextChars(afterHeight, ",rule=")) {
        const [, afterRule] = readChars(afterHeight, ",rule=")
        const [rule, end] = readNext(afterRule)
        if (isValidLifeRule(rule)) {
            rleFileHeaderData.rule = readLifeRule(rule)
            rleFileHeaderData.ruleString = rule;
        } else {
            throw new Error(`Invalid Rule found in RLE Data while parsing RLE Header Line: "${rule}" ( passed in "${headerLine}") `)
        }
    }

    return rleFileHeaderData
}

export function isRLEString(file: string): boolean {
    const lines = file.trim().split("\n")
    for (let i = 0; i < lines.length; i++) {
        if (!lines[i].trim().startsWith("#") && i < lines.length - 1) {
            return !throws(() => readRLEStringHeader(lines[i].trim()))
        }
    }

    return false;
}


export function readRLEString(file: string): RLEDecodedData {
    const lines = file.trim().split("\n")
    let currentLine = 0;

    const rleDecodedData: RLEDecodedData = {
        format: "rle",
        comments: [],
        name: "",
        creationData: "",
        topleft: [0, 0],
        foundTopLeft: false,
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
                rleDecodedData.comments.push(content)
            } else if (id === "N") {
                rleDecodedData.name = content
            } else if (id === "O") {
                rleDecodedData.creationData = content
            } else if (id === "P" || id === "R") {
                const [[x, y]] = readNumbers(afterID, 2)
                rleDecodedData.topleft = [x, y]
                rleDecodedData.foundTopLeft = true
            } else if (id === "r") {
                rleDecodedData.ruleString = content
                rleDecodedData.rule = readLifeRule(content)
            }

        }

        rleDecodedData.hashLines.push({
            content: afterID.trim(),
            id: id,
            full: lines[currentLine].trim()
        })

        currentLine++;
    }

    //header line
    const headerLineData = readRLEStringHeader(lines[currentLine])
    rleDecodedData.width = headerLineData.width;
    rleDecodedData.height = headerLineData.height
    if (headerLineData.ruleString !== null && headerLineData.rule !== null) {
        rleDecodedData.rule = headerLineData.rule
        rleDecodedData.ruleString = headerLineData.ruleString
    }
    
    //rle encoded data
    
    currentLine++;
    const afterHeader = lines.slice(currentLine).join("\n") 
    const data = readRLEData(afterHeader, rleDecodedData.topleft)

    rleDecodedData.liveCoordinates = data.liveCoordinates
    if (data.endingIndex + 1 !== afterHeader.length - 1) {
        const afterRLEData = afterHeader.substring(data.endingIndex + 1)
        const linesAfterRLEData = afterRLEData.split("\n")
        rleDecodedData.comments.push(...linesAfterRLEData.map(line => line.trim()).filter(line => line.length > 0))
    }


    //Everything after this is considered a comment

    return rleDecodedData
}

// --------------------------------------------------------------
// --------------------------------------------------------------
// --------------------------------------------------------------
// ------------------------- WRITING ----------------------------
// --------------------------------------------------------------
// --------------------------------------------------------------
// --------------------------------------------------------------

function rleEncode(char: string, count: number): string {
    if (char.length !== 1) {
        throw new Error(`[llcacodec] Cannot RLE Encode character ${char} with a length of ${char.length}. Length of character must be 1`)
    }
    if (count < 0 || !Number.isInteger(count)) {
        throw new Error(`[llcacodec] Cannot RLE Encode character ${char} with a count of ${count}. The count must be an integer greater than or equal to 1`)
    }

    if (count === 0) {
        return ""
    } else if (count === 1) {
        return char;
    } else {
        return `${count}${char}`
    }
}

function writeRLEDataM(matrix: (0 | 1)[][]) {
    const encoding: string[] = []

        for (let row = 0; row < matrix.length; row++) {
            let anyInLine: boolean = false;
            let currentLine: string[] = []
            for (let col = 0; col < matrix[row].length; col++) {
                if (matrix[row][col] === 1) {
                    anyInLine = true;
                    currentLine.push(RLE_LIVE_CELL_CHAR)
                } else if (matrix[row][col] === 0) {
                    currentLine.push(RLE_DEAD_CELL_CHAR)
                } else {
                    throw new Error(`[llcacodec] Cannot write RLE data where matrix has values that are not 0 or 1 ( got ${matrix[row][col]} at row ${row} and col ${col}) `)
                }
            }

            if (anyInLine) {
                encoding.push(...currentLine);
            }
            encoding.push(RLE_NEW_LINE_CHAR)
        }
        encoding.push(RLE_TERMINATION_CHAR)
        const rleEncodedBuffer: string[] = []

        let currentChar: string = encoding[0]
        let currentCharCount: number = 1
        for (let i = 1; i < encoding.length; i++) {
            if (encoding[i] === currentChar) {
                currentCharCount++;
            } else {
                rleEncodedBuffer.push(rleEncode(currentChar, currentCharCount))
                currentChar = encoding[i]
                currentCharCount = 1
            }
        }
        rleEncodedBuffer.push(RLE_TERMINATION_CHAR)
        return rleEncodedBuffer.join("")
}

function writeRLEDataC(liveCoordinates: [number, number][]) {
    if (liveCoordinates.length === 0) {
        return ""
    }

    return writeRLEDataM(numberPairArrayToMatrix(liveCoordinates))
}

const MAX_RLE_CHARACTER_LINE_WIDTH = 70

export function writeRLEString(data: RLEMatrixEncodingData | RLECoordinateEncodingData) {
    const comments: string[] = data.comments !== undefined ? [...data.comments] : []
    const creationData: string = data.creationData !== undefined ? data.creationData : ""
    const name: string = data.name !== undefined ? data.name : ""
    
    let bsRule: string = CONWAY_RULE_STRING_BS
    if (data.rule !== undefined) { 
        if (typeof(data.rule) === "string" || typeof(data.rule) === "number") {
            bsRule = convertLifeRule(data.rule, "b/s")
        } else {
            bsRule = makeLifeRule(data.rule, "b/s")
        }
    }
    
    let topleft = [0, 0]
    let width = 0;
    let height = 0;
    if ("matrix" in data) {
        width = Math.max(...data.matrix.map(row => row.length))
        height = data.matrix.length;
        topleft = data.topleft;
    } else if ("liveCoordinates" in data) {
        const bounds = getCellBoundingBox(data.liveCoordinates);
        width = bounds.width;
        height = bounds.height;
        topleft = [bounds.x, bounds.y]
    }

    const lineBuilder: string[] = []
    
    if (name !== "") {
        lineBuilder.push(`#N ${name}`)
    }
    if (creationData !== "") {
        lineBuilder.push(`#O ${creationData}`)
    }

    const trimmedComments = []
    for (let i = 0; i < comments.length; i++) {
        for (let j = 0; j < comments[i].length; j += MAX_RLE_CHARACTER_LINE_WIDTH) {
            trimmedComments.push(comments[i].substring(j, Math.min(comments[i].length, j + MAX_RLE_CHARACTER_LINE_WIDTH)))
        }
    }
    trimmedComments.forEach(trimmedComments => lineBuilder.push(`#C ${trimmedComments}`))

    lineBuilder.push(`x = ${width}, y = ${height}, rule = ${bsRule}`)
    lineBuilder.push("matrix" in data ? writeRLEDataM(data.matrix) : writeRLEDataC(data.liveCoordinates))
    return lineBuilder.join("\n")
}