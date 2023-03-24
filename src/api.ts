import { readLife106String, isLife106String, writeLife106String } from "./formats/file/life106"
import { readPlainTextString, isPlainTextString, PlainTextStringDecodedContents, writePlainTextMatrix, writePlainTextFromCoordinates } from "./formats/file/plaintext"
import { RLEFileData, isRLEString, readRLEString } from "./formats/file/rle"
import { Life105FileData, isLife105String, readLife105String } from "./formats/file/life105"
import { isCellCoordinateArray, isCellMatrix, isStringArray } from "./core/util"

export { LifeRuleData, CONWAY_LIFE_RULE_DATA } from "./formats/rule/ruleData"
export { readLifeRule, makeLifeRule, isValidLifeRule, getLifeRuleFormat } from "./formats/rule"

type SupportedLifeLikeFormats = "life 1.06" | "life 1.05" | "plaintext" | "rle"
type SupportedWriteFormats = "life 1.06" | "plaintext"
    
export function readLifeFileLiveCoordinates<T extends SupportedLifeLikeFormats>(data: string, format: T | ""): [number, number][] {
    switch (format) {
        case "plaintext": return readPlainTextString(data).liveCoordinates
        case "life 1.06": return readLife106String(data)
        case "life 1.05": return readLife105String(data).liveCoordinates
        case "rle": return readRLEString(data).liveCoordinates
        case "": {
            const format = getLifeFileFormat(data)
            if (format !== "N/A") {
                return readLifeFileLiveCoordinates(data, format)
            }
            throw new Error("")
        }
    }
    throw new Error("")
}

export function readLifeFile(data: string, format: "plaintext"): PlainTextStringDecodedContents
export function readLifeFile(data: string, format: "life 1.06"): [number, number][]
export function readLifeFile(data: string, format: "rle"): RLEFileData
export function readLifeFile(data: string, format: "life 1.05"): Life105FileData
export function readLifeFile(data: string, format: ""): [number, number][] | PlainTextStringDecodedContents | RLEFileData | Life105FileData
export function readLifeFile(data: string, format: SupportedLifeLikeFormats | "" = ""): [number, number][] | PlainTextStringDecodedContents | RLEFileData | Life105FileData {
    if (format === null || format === undefined) {
        throw new Error("Cannot parse null or undefined life file")
    }

    const foundFormat = format === "" ? getLifeFileFormat(data) : format;
    switch (foundFormat) {
        case "plaintext": return readPlainTextString(data);
        case "life 1.06": return readLife106String(data);
        case "rle": return readRLEString(data);
        case "life 1.05": return readLife105String(data);
        case "N/A": throw new Error(`[llcacodecjs] Could not read life file: matching life file format could not be found`) 
        default: throw new Error(`[llcacodecjs] Could not read life file: Invalid format of ${format} was inputted `)
    }
}

export function getLifeFileFormat(data: string): SupportedLifeLikeFormats | "N/A" {
    if (isLife106String(data)) {
        return "life 1.06"
    } else if (isLife105String(data)) {
        return "life 1.05"
    } else if (isRLEString(data)) {
        return "rle"
    } else if (isPlainTextString(data)) {
        return "plaintext"
    }
    
    return "N/A"
}

interface PlainTextMatrixWriteData {
    name: string,
    description: string | string[]
    matrix: (0 | 1)[][]
}

function isPlainTextMatrixWriteData(data: unknown): data is PlainTextMatrixWriteData {
    return typeof(data) === "object" && data !== null &&
    "name" in data && "description" in data && "matrix" in data &&
    typeof(data.name) === "string" && (typeof(data.description) === "string" || isStringArray(data.description)) &&
    isCellMatrix(data.matrix)
}

interface PlainTextCoordinateWriteData {
    name: string,
    description: string | string[]
    liveCoordinates: [number, number][]
}

function isPlainTextCoordinateWriteData(data: unknown): data is PlainTextCoordinateWriteData {
    return typeof(data) === "object" && data !== null &&
    "name" in data && "description" in data && "liveCoordinates" in data &&
    typeof(data.name) === "string" && (typeof(data.description) === "string" || isStringArray(data.description)) &&
    isCellCoordinateArray(data.liveCoordinates)
}

type FileFormatData = [number, number][] | PlainTextMatrixWriteData | PlainTextCoordinateWriteData

export function writeLifeFile(format: "life 1.06", data: [number, number][]): string;
export function writeLifeFile(format: "plaintext", data: PlainTextMatrixWriteData | PlainTextCoordinateWriteData): string
export function writeLifeFile(format: SupportedWriteFormats, data: FileFormatData): string {
    switch (format) {
        case "life 1.06":  {
            if (isCellCoordinateArray(data)) {
                return writeLife106String(data);
            }
            throw new Error(`[llcacodecjs] `)   
        }
        case "plaintext": {
            if (isPlainTextMatrixWriteData(data)) {
                return writePlainTextMatrix(data.matrix, data.name, data.description)
            } else if (isPlainTextCoordinateWriteData(data)) {
                return writePlainTextFromCoordinates(data.liveCoordinates, data.name, data.description)
            }
            throw new Error(`[llcacodecjs] `)

        }
    }
}
