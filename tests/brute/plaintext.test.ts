import { readPlaintextString } from "../../src/formats/file/plaintext"
import fs from "fs/promises"
import path from "path"

interface PlaintextFileData {
    fileName: string
    content: string
}

function isPlaintextFileData(data: unknown): data is PlaintextFileData {
    return typeof(data) === "object" && data !== null && "fileName" in data &&
    "content" in data && typeof(data.fileName) === "string" &&
    typeof(data.content) === "string"
}

test(`Brute force plaintext`, async () => {
    const plaintextDatas: PlaintextFileData[] = await fs.readFile( path.join(process.cwd(), "./tests/brute/plaintext.json" ) )
                                                .then(buffer => JSON.parse(buffer.toString("utf-8"))) as PlaintextFileData[]
    expect(() => isPlaintextFileData(plaintextDatas), `Plaintext Data not formatted correctly (got ${plaintextDatas})`)
    for (let i = 0; i < plaintextDatas.length; i++) {
        const { fileName, content } = plaintextDatas[i]
        expect(() => readPlaintextString(content), `Failed to parse file ${fileName}`).not.toThrow();
    }
})
