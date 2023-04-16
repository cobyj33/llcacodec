import { readLife106String } from "../../src/formats/file/life106";
import fsp from "fs/promises"
import path from "path"
import stringify from "json-stringify-pretty-compact"

const OUTPUT_DIRECTORY = "tests/brute/output/life106"
const FORMAT_NAME = "Life 1.06"

const FILES = [
    "tests/brute/llcacodec-test-data/wayneandlayne/blinkership1_106.lif",
    "tests/brute/llcacodec-test-data/wayneandlayne/blocker_106.lif",
    "tests/brute/llcacodec-test-data/wayneandlayne/enretard_106.lif",
    "tests/brute/llcacodec-test-data/wayneandlayne/gggwfishhook.lif",
    "tests/brute/llcacodec-test-data/wayneandlayne/gosperglidergun_106.lif",
    "tests/brute/llcacodec-test-data/wayneandlayne/oddtesttubebaby_106.lif",
    "tests/brute/llcacodec-test-data/wayneandlayne/piorbital_106.lif",
    "tests/brute/llcacodec-test-data/wayneandlayne/revolver_106.lif"
] as const

describe(`${FORMAT_NAME} Brute Integration Tests`, () => {

    beforeAll(async () => {
        await fsp.rm(OUTPUT_DIRECTORY, { "force": true, recursive: true })
        await fsp.mkdir(OUTPUT_DIRECTORY, { recursive: true })
    })

    describe.each(FILES)(`Brute force ${FORMAT_NAME}`, (filePath) => {
        test(`File ${path.basename(filePath)} exists`, async () => {
            const fileBuffer = await fsp.readFile(filePath);
            expect(fileBuffer.toString().length > 0).toBe(true)
        })
    
        test(`Parsing ${path.basename(filePath)} Does Not Throw`, async () => {
            const fileBuffer = await fsp.readFile(filePath);
            expect(() => readLife106String(fileBuffer.toString())).not.toThrow();
            const outputPath = path.join(OUTPUT_DIRECTORY, path.basename(filePath, path.extname(filePath))) + ".test.json"
            const outputString = stringify(readLife106String(fileBuffer.toString()), { "indent": 2 })
            await fsp.writeFile(outputPath, outputString)
        })
    })
})