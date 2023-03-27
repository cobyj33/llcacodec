"use strict";
/**
 * @file src/core/strRead.ts
 * @author Jacoby Johnson
 * @brief An abstraction to read tokens and patterns incrementally from a string
 *
 * Inspired from Java Scanner and C++ std::stringstream
 *
 * @note These functions were made just for llcacodec, so if there are any weird design decisions and a lot of thrown errors, that's why.
 * I wanted to write the functions in such a way that if I didn't account for any edge cases then I would break the library. It forces me to
 * think about every edge case and that's honestly how I want it to be. Also, if a file fails to parse, it simply throws a corresponding error
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.readNext = exports.readCrampedPositiveInteger = exports.readCrampedInteger = exports.readCrampedNumber = exports.readIntegers = exports.readNumbers = exports.readNegativeInteger = exports.readPositiveInteger = exports.readInteger = exports.readFloat = exports.readNumber = exports.readLine = exports.isNextChars = exports.readChars = exports.readChar = exports.isNextChar = void 0;
const util_1 = require("./util");
/**
 * @brief Checks if the next non white-space character from the string matches the given character
 *
 * If a char is specified, the next non white-space character must be that character or else an error is thrown
 *
 * @param data The string to read a character from
 * @param char A character to read. This string must have a length of 1 and must NOT be whitespace
 * @returns {boolean} If the next character in the given data string matches the provided character
 */
function isNextChar(data, char) {
    if (char.length !== 1) {
        throw new Error(`[llcacodec::isNextChar Cannot query for next ${char.length} length character. Character must have a length of 1`);
    }
    if (char === " ") {
        throw new Error(`[llcacodec::isNextChar Cannot query for next whitespace character`);
    }
    let index = 0;
    while (index < data.length) {
        if (data[index] !== " ") {
            return data[index] === char;
        }
        index++;
    }
    throw new Error("");
}
exports.isNextChar = isNextChar;
function readChar(data, char = "") {
    if (char.length > 1) {
        throw new Error(`[llcacodec::readChar Cannot read next ${char.length} length character. Character must have a length of 1]`);
    }
    if (char === " ") {
        throw new Error(`[llcacodec::readChar Cannot read whitespace character]`);
    }
    if (char === undefined) {
        throw new Error(`[llcacodec::readChar Cannot read undefined]`);
    }
    let index = 0;
    while (index < data.length) {
        if (data[index] !== " ") {
            if (char !== "" && char !== data[index]) {
                throw new Error(`[llcacodec::readChar Failed to read next character as ${char}, got ${data[index]}]`);
            }
            return [data[index], index + 1 < data.length ? data.substring(index + 1) : ""];
        }
        index++;
    }
    throw new Error("[strRead::readChar] Reached end of string and could not read any next characters");
}
exports.readChar = readChar;
function readChars(data, charOrCount) {
    if (typeof (charOrCount) === "string") {
        const charsToRead = charOrCount.split("");
        if (charsToRead.length === 0) {
            throw new Error("Cannot read 0 characters from a string");
        }
        let remainingString = data;
        for (let i = 0; i < charsToRead.length; i++) {
            const [, afterChar] = readChar(remainingString, charsToRead[i]);
            remainingString = afterChar;
        }
        return [charsToRead, remainingString];
    }
    else if (typeof (charOrCount) === "number") {
        if (!Number.isInteger(charOrCount)) {
            throw new Error("Cannot read a non-integer amount of characters from a string");
        }
        else if (charOrCount < 0) {
            throw new Error("Cannot read a negative amount of characters from a string");
        }
        const readChars = [];
        let remainingString = data;
        for (let i = 0; i < charOrCount; i++) {
            const [char, afterChar] = readChar(remainingString);
            remainingString = afterChar;
            readChars.push(char);
        }
        return [readChars, remainingString];
    }
    else {
        throw new Error("Passed in non-string non-number value to charOrCount of readChars");
    }
}
exports.readChars = readChars;
/**
 * @brief Determine if the next non-whitespace characters available in the data string follow the provided sequence
 *
 * @param data The data string to validate against
 * @param chars The characters
 * @returns {boolean} whether the next non-whitespace characters found in the string follow the provided sequence
 * @throws If any whitespace is passed into the "chars" string
 * @throws If the length of the passed in characters is 0
 */
function isNextChars(data, chars) {
    if (chars.length === 0) {
        throw new Error(`[llcacodec::isNextChars Cannot check if next characters in string is empty`);
    }
    let dataIndex = 0;
    let charsIndex = 0;
    while (dataIndex < data.length && charsIndex < chars.length) {
        if (chars[charsIndex] === " ") {
            throw new Error(`[llcacodec::isNextChars Cannot check if next character in string is whitespace`);
        }
        if (data[dataIndex] !== " ") {
            if (data[dataIndex] === chars[charsIndex]) {
                charsIndex++;
            }
            else {
                return false;
            }
        }
        dataIndex++;
    }
    return charsIndex === chars.length;
}
exports.isNextChars = isNextChars;
// /**
//  * Returns if the next non-whitespace string in the data parameter matches the given sequence
//  * @param data 
//  * @param sequence 
//  * @returns 
//  */
// export function isNextSeq(data: string, sequence: string): boolean {
//     let line: string[] = []
//     let index = 0;
//     let seqIndex = 0;
//     while (index < data.length) {
//         if (data[index] === " ") {
//             if (line.length === 0) {
//                 index++;
//                 continue;
//             } else {
//                 break;
//             }
//         }
//         line.push(data[index])
//         index++;
//     }
//     const str = line.join("")
//     return str === sequence
// }
// /**
//  * Reads the sequence from the string. If the next sequence in the string does not match the given sequence, an error is thrown
//  * @param data 
//  * @param sequence 
//  * @returns 
//  */
// export function readSeq(data: string, sequence: string): [string, string] {
//     let line: string[] = []
//     let index = 0;
//     while (index < data.length) {
//         if (data[index] === " ") {
//             if (line.length === 0) {
//                 index++;
//                 continue;
//             } else {
//                 break;
//             }
//         }
//         line.push(data[index])
//         index++;
//     }
//     const str = line.join("")
//     if (str === sequence) {
//         return [str, index < data.length ? data.substring(index) : ""];
//     }
//     throw new Error("")
// }
/**
 * @brief Reads the next line from the string.
 * @note The newline character is not retained in the returned line.
 * @param data The data string to read from
 * @returns {[string, string]} A tuple where the first entry is the line read from the string and the second entry is the remaining data in the data string
 * @throws If the next line in the string is not available (i.e. the data parameter is empty), an error is thrown
 */
function readLine(data) {
    if (data.length === 0) {
        throw new Error(`[llcacodec::readLine] Attempted to read line from an empty string`);
    }
    let index = 0;
    while (index < data.length && data[index] !== "\n") {
        index++;
    }
    //the value at data[index] is equal to \n, or it is at the end of the data string
    return [data.substring(0, index > 0 && data[index - 1] === "\r" ? index - 1 : index), index + 1 < data.length ? data.substring(index + 1) : ""];
}
exports.readLine = readLine;
/**
 * @brief Reads the next string of non whitespace characters from the data as a number.
 * @param data The data string to read from
 * @returns {[string, string]} A tuple, where the first entry is the number read from the string and the second entry is the remaining string after reading
 * @throws If the next string of non whitespace characters does not convert to a number
 */
function readNumber(data) {
    const [numstr, stream] = readNext(data);
    if ((0, util_1.isNumericString)(numstr)) {
        const num = Number(numstr);
        if (!isNaN(num)) {
            return [num, stream];
        }
        throw new Error(`[llcacodec::readNumber Number String ${numstr} incorrectly converted to NaN]`);
    }
    throw new Error(`[llcacodec::readNumber Number String ${numstr} is not a numerical string]`);
}
exports.readNumber = readNumber;
/**
 * @brief Reads the next sequence of non whitespace characters from the data as a float. The number MUST be a float value or else an error is thrown
 * @param data The data string to read from
 * @returns {[string, string]} A tuple, where the first entry is the float read from the string and the second entry is the remaining string after reading
 * @throws If the next string of non whitespace characters does not convert to a number
 * @throws If the next string of non whitespace characters is a number, but is not a float
 */
function readFloat(data) {
    const [num, stream] = readNumber(data);
    if (!Number.isInteger(num)) {
        return [num, stream];
    }
    throw new Error(`[llcacodec::readFloat Cannot read Decimal, as returned number is an Integer value]`);
}
exports.readFloat = readFloat;
/**
 * @brief Reads the next sequence of non whitespace characters from the data as a integer. The number MUST be a integer value or else an error is thrown
 * @param data The data string to read from
 * @returns {[string, string]} A tuple, where the first entry is the integer read from the string and the second entry is the remaining string after reading
 * @throws If the next string of non whitespace characters does not convert to a number
 * @throws If the next string of non whitespace characters is a number, but is not an integer
 */
function readInteger(data) {
    const [num, stream] = readNumber(data);
    if (Number.isInteger(num)) {
        return [num, stream];
    }
    throw new Error(`[llcacodec::readInteger Cannot read Decimal, as returned number is a float value]`);
}
exports.readInteger = readInteger;
/**
 * @brief Reads the next sequence of non whitespace characters from the data as a positive integer. The number MUST be a positive integer value or else an error is thrown
 * @param data The data string to read from
 * @returns {[string, string]} A tuple, where the first entry is the positive integer read from the string and the second entry is the remaining string after reading
 * @throws If the next string of non whitespace characters does not convert to a number
 * @throws If the next string of non whitespace characters is a number, but is not a positive integer
 */
function readPositiveInteger(data) {
    const [num, stream] = readInteger(data);
    if (num > 0) {
        return [num, stream];
    }
    throw new Error(`[llcacodec::readPositiveInteger Cannot read Positive Integer, as returned integer is less than 0]`);
}
exports.readPositiveInteger = readPositiveInteger;
/**
 * @brief Reads the next sequence of non whitespace characters from the data as a negative integer. The number MUST be a negative integer value or else an error is thrown
 * @param data The data string to read from
 * @returns {[string, string]} A tuple, where the first entry is the negative integer read from the string and the second entry is the remaining string after reading
 * @throws If the next string of non whitespace characters does not convert to a number
 * @throws If the next string of non whitespace characters is a number, but is not a negative integer
 */
function readNegativeInteger(data) {
    const [num, stream] = readInteger(data);
    if (num < 0) {
        return [num, stream];
    }
    throw new Error(`[llcacodec::readNegativeInteger Cannot read Negative Integer, as returned integer is greater than 0]`);
}
exports.readNegativeInteger = readNegativeInteger;
function readNumbers(data, numOfNums) {
    if (numOfNums < 0) {
        throw new Error(`Cannot read a negative amount of numbers`);
    }
    else if (!Number.isInteger(numOfNums)) {
        throw new Error(`Cannot read a decimal number of numbers`);
    }
    const numbers = [];
    let remaining = data;
    for (let i = 0; i < numOfNums; i++) {
        const [number, afterRead] = readNumber(remaining);
        numbers.push(number);
        remaining = afterRead;
    }
    return [numbers, remaining];
}
exports.readNumbers = readNumbers;
function readIntegers(data, numOfIntegers) {
    const [numbers, stream] = readNumbers(data, numOfIntegers);
    if (numbers.every(num => Number.isInteger(num))) {
        return [numbers, stream];
    }
    throw new Error(`Cannot read ${numOfIntegers} integers: Found non integer values: ${numbers.map((num, index) => [index, num]).filter(pair => !Number.isInteger(pair[1]))} `);
}
exports.readIntegers = readIntegers;
/**
 * Reads the next string of any representation of a number, ignoring white-space.
 * Only works with
 * @param data
 * @returns
 */
function readCrampedNumber(data) {
    let hitPoint = false;
    let i = 0;
    let numchars = [];
    while (i < data.length) {
        const char = data[i];
        if (char === " ") {
            if (numchars.length === 0) {
                i++;
                continue;
            }
            else {
                break;
            }
        }
        else if (char === "-") {
            if (numchars.length === 0) {
                numchars.push("-");
            }
            else {
                break;
            }
        }
        else if (char === ".") {
            if (hitPoint === false) {
                numchars.push(".");
                hitPoint = true;
            }
            else {
                break;
            }
        }
        else if ((0, util_1.isDigit)(char)) {
            numchars.push(char);
        }
        else {
            if (numchars.length === 0) {
                throw new Error(`Could not read cramped number (Encountered invalid char ${char} at index ${i} of string "${data}")`);
            }
            else {
                break;
            }
        }
        i++;
    }
    const numstr = numchars.join("");
    if ((0, util_1.isNumericString)(numstr)) {
        const num = Number(numstr);
        if (!isNaN(num)) {
            return [num, i < data.length ? data.substring(i) : ""];
        }
        throw new Error(`Cramped Number read as NaN (got "${numstr}" ) ( passed in: "${data}" )`);
    }
    throw new Error(`Cramped Number not evaluated to numeric string (got ${numstr} ) ( passed in: ${data})`);
}
exports.readCrampedNumber = readCrampedNumber;
function readCrampedInteger(data) {
    const [num, stream] = readCrampedNumber(data);
    if (Number.isInteger(num)) {
        return [num, stream];
    }
    throw new Error("Cannot read Cramped Integer");
}
exports.readCrampedInteger = readCrampedInteger;
function readCrampedPositiveInteger(data) {
    const [num, stream] = readCrampedInteger(data);
    if (num > 0) {
        return [num, stream];
    }
    throw new Error("Cannot read positive cramped integer");
}
exports.readCrampedPositiveInteger = readCrampedPositiveInteger;
/**
 * @brief Reads the next sequence of non whitespace characters from the data.
 * If the next string of non whitespace characters cannot be found, an error is thrown
 * @param data The data string to read from
 * @returns {[string, string]} A tuple where the first entry is the next string of non-whitespace characters found in the provided data,
 * and the second entry is the remaining data after reading
 * @throws If the next string of non whitespace characters cannot be found. (IE: The given string is empty or only contains whitespace)
 */
function readNext(data) {
    let index = 0;
    let startIndex = -1;
    while (index < data.length) {
        if (data[index] === " ") {
            if (startIndex === -1) {
                index++;
                continue;
            }
            else { // note that data[index] is still equal to whitespace
                return [index > 0 ? data.substring(startIndex, index) : "", index < data.length ? data.substring(index) : ""];
            }
        }
        if (startIndex === -1) {
            startIndex = index;
        }
        index++;
    }
    if (startIndex === -1) {
        throw new Error(`[llcacodec::readNext could not read sequence, no beginning to a non-whitespace sequence could be found (data: ${data})]`);
    }
    return [data.substring(startIndex, index), index < data.length ? data.substring(index) : ""];
}
exports.readNext = readNext;
