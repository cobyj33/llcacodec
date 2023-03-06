"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isStrictEqualBooleanArray = exports.isStrictEqualStringArray = exports.isStrictEqualNumberArray = exports.isStrictEqualArray = exports.byteArrayAsString = exports.pushUTFBytes = exports.getErrorMessage = exports.isError = exports.numberPairArrayToMatrix = exports.getCellBoundingBox = exports.isNumberPairArray = exports.isIntegerString = exports.trimTrailing = exports.isNumericString = exports.isDigit = exports.isRectangularMatrix = void 0;
/**
 * Test if a matrix is rectangular or not
 *
 * A matrix is considered rectangular if it's height is not 0, and all rows have the same amount of columns
 *
 * @param matrix A matrix of a data type
 * @returns If the matrix is rectangular or not
 */
function isRectangularMatrix(matrix) {
    if (matrix.length === 0)
        return true;
    const width = matrix[0].length;
    for (let row = 0; row < matrix.length; row++) {
        if (matrix[row].length !== width)
            return false;
    }
    return true;
}
exports.isRectangularMatrix = isRectangularMatrix;
const DIGIT_DECIMAL_CHARACTERS = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];
const DIGIT_BINARY_CHARACTERS = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];
const DIGIT_HEX_CHARACTERS = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "A", "B", "C", "D", "E", "F", "a", "b", "c", "d", "e", "f"];
const ASCII_CHAR_CODE_0 = 48;
const ASCII_CHAR_CODE_9 = 57;
function isDigit(digit) {
    return digit.length === 1 && digit.charCodeAt(0) >= ASCII_CHAR_CODE_0 && digit.charCodeAt(0) <= ASCII_CHAR_CODE_9;
}
exports.isDigit = isDigit;
// An unnecessarily complicated problem in Javascript: https://stackoverflow.com/questions/175739/how-can-i-check-if-a-string-is-a-valid-number 
const isNumericString = (num) => num.trim() !== '' && !isNaN(num);
exports.isNumericString = isNumericString;
function trimTrailing(s, charToTrim) {
    if (charToTrim.length !== 1) {
        throw new Error("");
    }
    const regExp = new RegExp(charToTrim + "+$");
    const result = s.replace(regExp, "");
    return result;
}
exports.trimTrailing = trimTrailing;
function isIntegerString(num) {
    for (let i = 0; i < num.length; i++) {
        if (i === 0) {
            if (!isDigit(num[i]) && num[i] !== "-") {
                return false;
            }
        }
        else {
            if (!isDigit(num[i])) {
                return false;
            }
        }
    }
    return true;
}
exports.isIntegerString = isIntegerString;
function isNumberPairArray(num) {
    return num.every(row => row.length === 2);
}
exports.isNumberPairArray = isNumberPairArray;
/**
 *
 * @param positions
 * @returns Bounds object (maxY is given with the basis that positive is up)
 */
function getCellBoundingBox(positions) {
    if (positions.length === 0) {
        throw new Error("Cannot create bounding box over empty area");
    }
    let minY = positions[0][1];
    let maxY = positions[0][1];
    let minX = positions[0][0];
    let maxX = positions[0][0];
    for (let i = 0; i < positions.length; i++) {
        minY = Math.min(minY, positions[i][1]);
        minX = Math.min(minX, positions[i][0]);
        maxY = Math.max(maxY, positions[i][1]);
        maxX = Math.max(maxX, positions[i][0]);
    }
    return { x: minX, y: maxY, width: Math.abs(maxX - minX) + 1, height: Math.abs(maxY - minY) + 1 };
}
exports.getCellBoundingBox = getCellBoundingBox;
function numberPairArrayToMatrix(positions) {
    if (positions.length === 0) {
        return [];
    }
    const bounds = getCellBoundingBox(positions);
    const matrix = Array.from({ length: bounds.height }, () => new Array(bounds.width).fill(0));
    positions.forEach(position => {
        matrix[bounds.y - position[1]][position[0] - bounds.x] = 1;
    });
    return matrix;
}
exports.numberPairArrayToMatrix = numberPairArrayToMatrix;
function isError(e) {
    return typeof (e) === "object" && e !== null && "stack" in e && typeof (e.stack) === 'string' && "message" in e && typeof (e.message) === 'string';
}
exports.isError = isError;
function getErrorMessage(e) {
    if (isError(e)) {
        return e.message;
    }
    else if (typeof (e) === "string") {
        return e;
    }
    else {
        if ("toString" in e) {
            return e.toString();
        }
    }
    return "";
}
exports.getErrorMessage = getErrorMessage;
function pushUTFBytes(byteData, str) {
    byteData.push(...str.split("").map(ch => ch.charCodeAt(0)));
}
exports.pushUTFBytes = pushUTFBytes;
function byteArrayAsString(byteData) {
    return byteData.map(val => String.fromCharCode(val)).join("");
}
exports.byteArrayAsString = byteArrayAsString;
/**
 * Determines if two arrays are strictly the same
 *
 * Number arrays are considered the same if they have the same length and every data point at every index is the same
 *
 * @param first A number array
 * @param second Another number array
 * @returns Whether the two number arrays are considered equal according to the described conditions
 */
function isStrictEqualArray(first, second) {
    if (first.length !== second.length) {
        return false;
    }
    const length = first.length;
    for (let i = 0; i < length; i++) {
        if (first[i] !== second[i]) {
            return false;
        }
    }
    return true;
}
exports.isStrictEqualArray = isStrictEqualArray;
const isStrictEqualNumberArray = (first, second) => isStrictEqualArray(first, second);
exports.isStrictEqualNumberArray = isStrictEqualNumberArray;
const isStrictEqualStringArray = (first, second) => isStrictEqualArray(first, second);
exports.isStrictEqualStringArray = isStrictEqualStringArray;
const isStrictEqualBooleanArray = (first, second) => isStrictEqualArray(first, second);
exports.isStrictEqualBooleanArray = isStrictEqualBooleanArray;
