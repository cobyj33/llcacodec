import { ByteArray } from "../core/byteArray"
import { isIntegerString } from "../core/util"
import { Set2D } from "../core/set2D"

const LIFE_106_HEADER = "#Life 1.06" as const
const LIFE_106_FILE_EXTENSIONS = [".lif", ".life"] as const

export function writeLife106String(data: [number, number][]): string {
    const byteArray = new ByteArray()
    byteArray.writeUTFBytes(LIFE_106_HEADER + "\n")
    const dupSet: Set2D = new Set2D();

    for (let i = 0; i < data.length; i++) {
        const [x, y] = data[i];
        if (dupSet.has(x, y)) {
            continue;
        }

        byteArray.writeUTFBytes(`${x} ${y}\n`)
        dupSet.add(x, y)
    }

    return byteArray.getString();
}

export function isLife106String(str: string): boolean {
    try {
        readLife106String(str);
        return true;
    } catch (e) {
        return false;
    }
}

export function readLife106String(str: string): [number, number][] {
    if (str.startsWith(LIFE_106_HEADER + "\n")) {
        const output: [number, number][] = []
        const lines = str.split("\n")
        let ended: boolean = false;

        for (let i = 1; i < lines.length; i++) {
            const nums = lines[i].trim().split(" ")
            if (nums.length !== 2) {
                if (nums.length === 0 || nums.every(val => val.length === 0)) { // Check if there are any extra lines at the end. This is true if there is no input or if all input is empty strings
                    ended = true;
                    continue;
                }
                throw new Error(`Invalid Life 1.06 string. Error at Line ${i}. There must be an X and a Y position only on subsequent lines after the Life 1.06 Header \n${str}\n `)
            }

            if (ended) {
                throw new Error(`Invalid Life 1.06 string: \n${str}\n Error at Line ${i}. X and Y Values must be on subsequent lines`)
            }

            if (isIntegerString(nums[0]) && isIntegerString(nums[1])) {
                output.push([Number.parseInt(nums[0]), Number.parseInt(nums[1])])
            } else {
                throw new Error(`Invalid Life 1.06 string. Error at Line ${i}. Cell positions must be integers ( got ${nums[0]} and ${nums[1]}) \n${str}\n `)
            }
        }

        return output;
    } else {
        throw new Error(`Could not read Life 1.06 string. Error at Line 1: does not begin with appropriate header. Must be "${LIFE_106_HEADER}" ${str}`)
    }
}