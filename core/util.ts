

/**
 * Test if a matrix is rectangular or not
 * 
 * A matrix is considered rectangular if it's height is not 0, and all rows have the same amount of columns
 * 
 * @param matrix A matrix of a data type
 * @returns If the matrix is rectangular or not
 */
export function isRectangularMatrix<T>(matrix: T[][]): boolean {
    if (matrix.length === 0) return true;
    const width = matrix[0].length;

    for (let row = 0; row < matrix.length; row++) {
        if (matrix[row].length !== width) return false;
    }
    return true;
}

const ASCII_CHAR_CODE_0 = 48;
const ASCII_CHAR_CODE_9 = 57;

export function isDigit(digit: string): boolean {
    return digit.length === 1 && digit.charCodeAt(0) >= 48 && digit.charCodeAt(0) <= 57
} 

export function isIntegerString(num: string): boolean {
    for (let i = 0; i < num.length; i++) {
        if (i === 0) {
            if (!isDigit(num[i]) || num[i] === "-") {
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

export function pushUTFBytes(data: number[], str: string) {
    data.push(...str.split("").map(ch => ch.charCodeAt(0)))
}