import { ByteArray } from "../core/byteArray"
import { numberPairArrayToMatrix } from "../core/util"

const PLAIN_TEXT_HEADER_BEGINNING = "!Name: "

function writePlainTextMetadata(byteArray: ByteArray, name: string, description: string | string[]): void {
    byteArray.writeUTFBytes(PLAIN_TEXT_HEADER_BEGINNING + name + "\n")
    if (description.length > 0) {
        if (typeof(description) === "string") {
                const lines = description.split("\n")
                lines.forEach(line => byteArray.writeUTFBytes(`!${line}\n`))
        } else {
            const lines = description.flatMap(lines => lines.split("\n"))
            lines.forEach(line => byteArray.writeUTFBytes(`!${line}\n`))
        }
    }

    byteArray.writeUTFBytes("!\n")
}

export function writePlainTextFromCoordinates(positions: [number, number][], name: string, description: string | string[]): string {
    return writePlainTextMatrix(numberPairArrayToMatrix(positions) as (0 | 1)[][], name, description)    
}

export function writePlainTextMatrix(data: (0 | 1)[][], name: string, description: string | string[]): string {
    const byteArray = new ByteArray();
    writePlainTextMetadata(byteArray, name, description)

    const height = data.length;
    const width = Math.max(...data.map(row => row.length))

    for (let row = 0; row < height; row++) {
        for (let col = 0; col < width; col++) {
            if (col >= data[row].length) {
                byteArray.writeUTFBytes(".");
            } else {
                byteArray.writeUTFBytes(data[row][col] === 0 ? "." : "O");
            }
        }
        byteArray.writeUTFBytes("\n")
    }

    return byteArray.getString();
}