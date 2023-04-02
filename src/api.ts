import { readLife106String, isLife106String, writeLife106String, Life106DecodedData, Life106EncodingData } from "./formats/file/life106"
import { readPlaintextString, isPlaintextString, PlaintextDecodedData, PlaintextMatrixWriteData, PlaintextCoordinateWriteData, writePlaintextString } from "./formats/file/plaintext"
import { RLECoordinateEncodingData, RLEDecodedData, RLEMatrixEncodingData, isRLEString, readRLEString, writeRLEString } from "./formats/file/rle"
import { Life105DecodedData, isLife105String, readLife105String } from "./formats/file/life105"

export { LifeRuleData, CONWAY_LIFE_RULE_DATA } from "./formats/rule/ruleData"
export { readLifeRule, makeLifeRule, isValidLifeRule, getLifeRuleFormat } from "./formats/rule"

type SupportedLifeLikeFormats = "life 1.06" | "life 1.05" | "plaintext" | "rle"
    
export function readLifeString(data: string, format: "plaintext"): PlaintextDecodedData
export function readLifeString(data: string, format: "life 1.06"): Life106DecodedData
export function readLifeString(data: string, format: "rle"): RLEDecodedData
export function readLifeString(data: string, format: "life 1.05"): Life105DecodedData
export function readLifeString(data: string): Life106DecodedData | PlaintextDecodedData | RLEDecodedData | Life105DecodedData
export function readLifeString(data: string, format: SupportedLifeLikeFormats | "" = ""): Life106DecodedData | PlaintextDecodedData | RLEDecodedData | Life105DecodedData {
    if (format === undefined) {
        throw new Error("Cannot parse undefined life file")
    }

    const foundFormat = format === "" ? getLifeFileFormat(data) : format;
    switch (foundFormat) {
        case "plaintext": return readPlaintextString(data);
        case "life 1.06": return readLife106String(data);
        case "rle": return readRLEString(data);
        case "life 1.05": return readLife105String(data);
        case "": throw new Error(`[llcacodecjs] Could not read life file: matching life file format could not be found`) 
    }
}

export function isLifeStringFormat(data: string, format: SupportedLifeLikeFormats): boolean {
    switch (format) {
        case "life 1.06": return isLife106String(data);
        case "life 1.05": return isLife105String(data);
        case "plaintext": return isPlaintextString(data);
        case "rle": return isRLEString(data);
    }
}

export function getLifeFileFormat(data: string): SupportedLifeLikeFormats | "" {
    if (isLife106String(data)) {
        return "life 1.06"
    } else if (isLife105String(data)) {
        return "life 1.05"
    } else if (isRLEString(data)) {
        return "rle"
    } else if (isPlaintextString(data)) {
        return "plaintext"
    }
    
    return ""
}

type FileFormatData = ( Life106EncodingData & { format: "life 1.06"} ) | 
( PlaintextMatrixWriteData & { format: "plaintext"} ) | 
( PlaintextCoordinateWriteData & { format: "plaintext"} ) |
( RLEMatrixEncodingData & { format: "rle" } ) |
( RLECoordinateEncodingData & { format: "rle" })

export function writeLifeString(data: FileFormatData): string {
    switch (data.format) {
        case "life 1.06": return writeLife106String(data);
        case "plaintext": return writePlaintextString(data);
        case "rle": return writeRLEString(data)
    }
}
