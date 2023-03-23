import { readPlainTextString } from "../../src/formats/file/plaintext"
import fs from "fs/promises"
import path from "path"

interface PlainTextFileData {
    fileName: string
    content: string
}

function isPlainTextFileData(data: unknown): data is PlainTextFileData {
    return typeof(data) === "object" && data !== null && "fileName" in data &&
    "content" in data && typeof(data.fileName) === "string" &&
    typeof(data.content) === "string"
}

test(`Brute force plaintext`, async () => {
    const plaintextDatas: PlainTextFileData[] = await fs.readFile( path.join(process.cwd(), "./tests/brute/plaintext.json" ) )
                                                .then(buffer => JSON.parse(buffer.toString("utf-8"))) as PlainTextFileData[]
    expect(() => isPlainTextFileData(plaintextDatas), `PlainText Data not formatted correctly (got ${plaintextDatas})`)
    for (let i = 0; i < plaintextDatas.length; i++) {
        const { fileName, content } = plaintextDatas[i]
        expect(() => readPlainTextString(content), `Failed to parse file ${fileName}`).not.toThrow();
    }
})
