import { isIntegerString } from "../../core/util";
import { Set2D } from "../../core/set2D"

const LIFE_106_HEADER = "#Life 1.06" as const
const LIFE_106_FILE_EXTENSIONS = [".lif", ".life"] as const

export function isLife106String(str: string): boolean {
    return str.trim().startsWith(LIFE_106_HEADER)
}

export interface Life106DecodedData {
    format: "life 1.06"
    liveCoordinates: [number, number][]
}

export interface Life106EncodingData {
    liveCoordinates: [number, number][]
}

// --------------------------------------------------------------
// --------------------------------------------------------------
// --------------------------------------------------------------
// ------------------------- WRITING ----------------------------
// --------------------------------------------------------------
// --------------------------------------------------------------
// --------------------------------------------------------------

export function writeLife106String(data: Life106EncodingData): string {
    const builder: string[] = []
    builder.push(LIFE_106_HEADER + "\n")
    const dupSet: Set2D = new Set2D();

    for (let i = 0; i < data.liveCoordinates.length; i++) {
        const [x, y] = data.liveCoordinates[i];
        if (dupSet.has(x, y)) {
            continue;
        }

        builder.push(`${x} ${y}\n`)
        dupSet.add(x, y)
    }

    return builder.join("")
}

// --------------------------------------------------------------
// --------------------------------------------------------------
// --------------------------------------------------------------
// ------------------------- READING ----------------------------
// --------------------------------------------------------------
// --------------------------------------------------------------
// --------------------------------------------------------------


export function readLife106String(str: string): Life106DecodedData {
    if (!str.trim().startsWith(LIFE_106_HEADER)) {
        throw new Error(`Could not read Life 1.06 string. Error at Line 1: does not begin with appropriate header. Must be "${LIFE_106_HEADER}" ${str}`)
    }

    const output: [number, number][] = []
    const set2D: Set2D = new Set2D()
    const lines = str.split("\n")
    let ended: boolean = false;

    for (let i = 1; i < lines.length; i++) {
        const nums = lines[i].trim().split(" ").filter(val => val.length > 0)
        if (nums.length !== 2) {
            if (nums.length === 0) { // Check if there are any extra lines at the end. This is true if there is no input or if all input is empty strings
                ended = true;
                continue;
            }
            throw new Error(`Invalid Life 1.06 string. Error at Line ${i}. There must be an X and a Y position only on subsequent lines after the Life 1.06 Header \n${str}\n `)
        }

        if (ended) {
            throw new Error(`Invalid Life 1.06 string: \n${str}\n Error at Line ${i}. X and Y Values must be on subsequent lines`)
        }

        if (isIntegerString(nums[0]) && isIntegerString(nums[1])) {
            const [x, y] = [Number.parseInt(nums[0]), Number.parseInt(nums[1])]
            if (!set2D.has(x, y)) {
                set2D.add(x, y)
                output.push([x, y])
            }
        } else {
            throw new Error(`Invalid Life 1.06 string. Error at Line ${i}. Cell positions must be integers ( got ${nums[0]} and ${nums[1]}) \n${str}\n `)
        }
    }

    return {
        format: "life 1.06",
        liveCoordinates: output
    };
}