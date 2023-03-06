import { readLife106String, isLife106String } from "./formats/life106"
import { readPlainTextString, isPlainTextString, PlainTextStringDecodedContents } from "./formats/plaintext"

type SupportedLifeLikeFormats = "Life 1.06" | "plaintext"
    
export function readPatternCoordinatesFromFile<T extends SupportedLifeLikeFormats>(data: string, format: T | ""): [number, number][] {
    switch (format) {
        case "plaintext": return readPlainTextString(data).cellCoordinates
        case "Life 1.06": return readLife106String(data)
        case "": {
            const format = getLifeFileFormat(data)
            if (format !== "N/A") {
                return readPatternCoordinatesFromFile(data, format)
            }
            throw new Error("")
        }
    }
    throw new Error("")
}

export function readLifeFile(data: string, format: "plaintext"): PlainTextStringDecodedContents
export function readLifeFile(data: string, format: "Life 1.06"): [number, number][]
export function readLifeFile(data: string, format: SupportedLifeLikeFormats | "" = ""): [number, number][] | PlainTextStringDecodedContents {
    switch (format) {
        case "plaintext": return readPlainTextString(data);
        case "Life 1.06": return readLife106String(data);
        case "": {
            const format = getLifeFileFormat(data)
            if (format === "plaintext") {
                return readLifeFile(data, format)
            } else if (format === "Life 1.06") {
                return readLifeFile(data, format)
            }
            throw new Error("") 
        }
    }
}

export function getLifeFileFormat(data: string): SupportedLifeLikeFormats | "N/A" {
    if (isLife106String(data)) {
        return "Life 1.06"
    }
    if (isPlainTextString(data)) {
        return "plaintext"
    }
    return "N/A"
}
