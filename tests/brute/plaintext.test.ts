import { readPlainTextString } from "../../src/formats/file/plaintext"
import fs from "fs/promises"

interface PlainTextFileData {
    fileName: string
    content: string
}

function isPlainTextFileData(data: unknown): data is PlainTextFileData {
    return typeof(data) === "object" && data !== null && "fileName" in data && "content" in data && typeof(data.fileName) === "string" && typeof(data.content) === "string"
}

let CONWAY_LIFE_PLAINTEXT_CELLS_PATTERNS: PlainTextFileData[] = []

beforeAll(async () => {
    const data = await fs.readFile("./plaintext.json")
    .then(buffer => JSON.parse(buffer.toString()))

    if (typeof(data) === "object" && data !== null && Array.isArray(data) && data.every(entry => isPlainTextFileData(entry))) {
        CONWAY_LIFE_PLAINTEXT_CELLS_PATTERNS = data as PlainTextFileData[]
    } else {
        throw new Error("Error reading Plaintext JSON data, data could not be found to fit the given PlainTextFileData format")
    }
})

describe.each(CONWAY_LIFE_PLAINTEXT_CELLS_PATTERNS)("Brute force plaintext", ({ fileName, content }) => {
    test(`Parsing ${fileName} Does Not Throw`, () => {
        expect(() => readPlainTextString(content)).not.toThrow();
    })
})