/**
 * Test if a matrix is rectangular or not
 *
 * A matrix is considered rectangular if it's height is not 0, and all rows have the same amount of columns
 *
 * @param matrix A matrix of a data type
 * @returns If the matrix is rectangular or not
 */
export declare function isRectangularMatrix(matrix: any[][]): boolean;
export declare function isDigit(digit: string): boolean;
export declare const isNumericString: (num: string) => boolean;
export declare function trimTrailing(s: string, charToTrim: string): string;
export declare function isIntegerString(num: string): boolean;
export declare function isNumberPairArray(num: number[][]): num is [number, number][];
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
export declare function pushUTFBytes(byteData: number[], str: string): void;
export declare function byteArrayAsString(byteData: number[]): string;
export {};
//# sourceMappingURL=util.d.ts.map