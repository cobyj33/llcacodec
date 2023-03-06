

/**
 * Test if a matrix is rectangular or not
 * 
 * A matrix is considered rectangular if it's height is not 0, and all rows have the same amount of columns
 * 
 * @param matrix A matrix of a data type
 * @returns If the matrix is rectangular or not
 */
export function isRectangularMatrix(matrix: any[][]): boolean {
    if (matrix.length === 0) return true;
    const width = matrix[0].length;

    for (let row = 0; row < matrix.length; row++) {
        if (matrix[row].length !== width) return false;
    }
    return true;
}

const DIGIT_DECIMAL_CHARACTERS = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"] as const
const DIGIT_BINARY_CHARACTERS = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"] as const
const DIGIT_HEX_CHARACTERS = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "A", "B", "C", "D", "E", "F", "a", "b", "c", "d", "e", "f"] as const

const ASCII_CHAR_CODE_0 = 48;
const ASCII_CHAR_CODE_9 = 57;

export function isDigit(digit: string): boolean {
    return digit.length === 1 && digit.charCodeAt(0) >= ASCII_CHAR_CODE_0 && digit.charCodeAt(0) <= ASCII_CHAR_CODE_9
} 

// An unnecessarily complicated problem in Javascript: https://stackoverflow.com/questions/175739/how-can-i-check-if-a-string-is-a-valid-number 
export const isNumericString = (num: string) => num.trim() !== '' && !isNaN(num as unknown as number);


export function trimTrailing(s: string, charToTrim: string) {
    if (charToTrim.length !== 1) {
        throw new Error("")
    }

    const regExp = new RegExp(charToTrim + "+$");
    const result = s.replace(regExp, "");

    return result;
}

export function isIntegerString(num: string): boolean {
    for (let i = 0; i < num.length; i++) {
        if (i === 0) {
            if (!isDigit(num[i]) && num[i] !== "-") {
                return false;
            }
        } else {
            if (!isDigit(num[i])) {
                return false;
            }
        }
    }
    return true;
}

export function isNumberPairArray(num: number[][]): num is [number, number][] {
    return num.every(row => row.length === 2)
}

type Bounds = { x: number, y: number, width: number, height: number  }

/**
 * 
 * @param positions 
 * @returns Bounds object (maxY is given with the basis that positive is up)
 */
export function getCellBoundingBox(positions: [number, number][]): Bounds {
    if (positions.length === 0) {
        throw new Error("Cannot create bounding box over empty area");
    }

    let minY = positions[0][1];
    let maxY = positions[0][1];
    let minX = positions[0][0];
    let maxX = positions[0][0];

    for (let i = 0; i < positions.length; i++) {
        minY = Math.min(minY, positions[i][1])
        minX = Math.min(minX, positions[i][0])
        maxY = Math.max(maxY, positions[i][1])
        maxX = Math.max(maxX, positions[i][0])
    }

    return { x: minX, y: maxY, width: Math.abs(maxX - minX) + 1, height: Math.abs(maxY - minY) + 1 }
}

export function numberPairArrayToMatrix(positions: [number, number][]): (0 | 1)[][] {
    if (positions.length === 0) {
        return [];
    }

    const bounds = getCellBoundingBox(positions);
    const matrix: (0 | 1)[][] = Array.from({ length: bounds.height }, () => new Array<0>(bounds.width).fill(0));
    positions.forEach(position => {
        matrix[bounds.y - position[1]][position[0] - bounds.x] = 1;
    })
    return matrix;
}

export function isError(e: any): e is Error {
    return typeof(e) === "object" && e !== null && "stack" in e && typeof(e.stack) === 'string' && "message" in e && typeof(e.message) === 'string';
}

export function getErrorMessage(e: any): string {
    if (isError(e)) {
        return e.message;
    } else if (typeof(e) === "string") {
        return e;
    } else {
        if ("toString" in e) {
            return e.toString();
        }
    }
    return ""
}

export function pushUTFBytes(byteData: number[], str: string) {
    byteData.push(...str.split("").map(ch => ch.charCodeAt(0)))
}

export function byteArrayAsString(byteData: number[]): string {
    return byteData.map(val => String.fromCharCode(val)).join("")
}

/**
 * Determines if two arrays are strictly the same
 * 
 * Number arrays are considered the same if they have the same length and every data point at every index is the same
 * 
 * @param first A number array
 * @param second Another number array
 * @returns Whether the two number arrays are considered equal according to the described conditions
 */
export function isStrictEqualArray(first: any[], second: any[]): boolean {
    if (first.length !== second.length) {
        return false;
    }
    const length = first.length

    for (let i = 0; i < length; i++) {
        if (first[i] !== second[i]) {
            return false;
        }
    }
    return true;
}

export const isStrictEqualNumberArray: (first: number[], second: number[]) => boolean = (first, second) => isStrictEqualArray(first, second)
export const isStrictEqualStringArray: (first: string[], second: string[]) => boolean = (first, second) => isStrictEqualArray(first, second)
export const isStrictEqualBooleanArray: (first: boolean[], second: boolean[]) => boolean = (first, second) => isStrictEqualArray(first, second)