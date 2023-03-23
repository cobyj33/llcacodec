/**
 * Test if a matrix is rectangular or not
 *
 * A matrix is considered rectangular if it's height is not 0, and all rows have the same amount of columns
 *
 * @param matrix A matrix of a data type
 * @returns If the matrix is rectangular or not
 */
export declare function isRectangularMatrix(matrix: unknown[][]): boolean;
/**
 * Check whether a function throws an error when called
 *
 * @param action The function to envoke to check if it throws an error
 * @returns Whether the function throws an error upon invokation
 */
export declare function throws(action: () => unknown): boolean;
export declare function isDigit(digit: string): boolean;
export declare const isNumericString: (num: string) => boolean;
export declare function trimTrailing(s: string, charToTrim: string): string;
export declare function isIntegerString(num: string): boolean;
export declare function isNumberPairArray(arr: unknown): arr is [number, number][];
export declare function isCellMatrix(arr: unknown): arr is (0 | 1)[][];
export declare function isCellCoordinateArray(arr: unknown): arr is [number, number][];
export declare function isStringArray(arr: unknown): arr is string[];
type Bounds = {
    x: number;
    y: number;
    width: number;
    height: number;
};
/**
 *
 * @param positions
 * @returns Bounds object (maxY is given with the basis that positive is up)
 */
export declare function getCellBoundingBox(positions: [number, number][]): Bounds;
export declare function numberPairArrayToMatrix(positions: [number, number][]): (0 | 1)[][];
export declare function isError(e: any): e is Error;
export declare function getErrorMessage(e: any): string;
export declare function reverseBits(num: number): number;
export declare function pushASCIIBytes(byteData: number[], str: string): void;
export declare function byteArrayAsASCII(byteData: number[]): string;
/**
 * Determines if two arrays are strictly the same
 *
 * Number arrays are considered the same if they have the same length and every data point at every index is the same
 *
 * @param first A number array
 * @param second Another number array
 * @returns Whether the two number arrays are considered equal according to the described conditions
 */
export declare function isStrictEqualArray(first: any[], second: any[]): boolean;
export declare const isStrictEqualNumberArray: (first: number[], second: number[]) => boolean;
export declare const isStrictEqualStringArray: (first: string[], second: string[]) => boolean;
export declare const isStrictEqualBooleanArray: (first: boolean[], second: boolean[]) => boolean;
export {};
//# sourceMappingURL=util.d.ts.map