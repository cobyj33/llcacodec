import { readLife106String } from "../formats/life106"
import { readPlainTextString } from "../formats/plaintext"

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
