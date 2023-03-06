import { readLife106String, isLife106String } from "./formats/life106"
import { readPlainTextString, isPlainTextString } from "./formats/plaintext"

type SupportedLifeLikeFormats = "Life 1.06" | "plaintext"
type ReturnedFileData<T> = 
    T extends "plaintext" ? ReturnType<typeof readPlainTextString> :
    T extends "Life 1.06" ? ReturnType<typeof readLife106String> :
    never;

export function readLifeFile<T extends SupportedLifeLikeFormats>(data: string, format: T): ReturnedFileData<T> {
    switch (format) {
        case "plaintext": return readPlainTextString(data) as ReturnedFileData<T>;
        case "Life 1.06": return readLife106String(data) as ReturnedFileData<T>;
    }
    throw new Error("")
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
