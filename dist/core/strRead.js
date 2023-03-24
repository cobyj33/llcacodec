"use strict";
/**
 * An abstraction to treat a string as a parsed stream of characters
 *
 * Inspired from Java Scanner and C++ std::stringstream
 *
 * StringStream's philosophy is to provide an easier API to make operating on string data formats easier through abstracting away common operations like reading lines, reading the next word, and querying if certain patterns appear in order
 *
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.readNext = exports.readCrampedPositiveInteger = exports.readCrampedInteger = exports.readCrampedNumber = exports.readIntegers = exports.readNumbers = exports.readNegativeInteger = exports.readPositiveInteger = exports.readInteger = exports.readDecimal = exports.readNumber = exports.readLine = exports.readSeq = exports.isNextSeq = exports.isNextChars = exports.readChars = exports.readChar = exports.isNextChar = void 0;
const util_1 = require("./util");
/**
 * Reads the next non white-space character from the string
 * If a char is specified, the next non white-space character must be that character or else an error is thrown
 * @param data The string to read a character from
 * @returns {[string, string]} where the first value is the read character and the second value is the remaining data string
 */
function isNextChar(data, char) {
    if (char.length !== 1) {
        throw new Error("");
    }
    if (char === " ") {
        throw new Error("unimplemented");
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
/**
 * Reads the next non white-space character from the string
 * If a char is specified, the next non white-space character must be that character or else an error is thrown
 * @param data The string to read a character from
 * @returns {[string, string]} where the first value is the read character and the second value is the remaining data string
 */
function readChar(data, char = "") {
    if (char.length > 1) {
        throw new Error("");
    }
    if (char === " ") {
        throw new Error("unimplemented");
    }
    let index = 0;
    while (index < data.length) {
        if (data[index] !== " ") {
            return [data[index], index + 1 < data.length ? data.substring(index + 1) : ""];
        }
        index++;
    }
    throw new Error("");
}
exports.readChar = readChar;
function readChars(data, charOrCount) {
    if (typeof (charOrCount) === "string") {
        if (charOrCount.length === 0) {
            throw new Error("Cannot read 0 characters from a string");
        }
        const charReadingArray = charOrCount.split("");
        let remainingString = data;
        for (let i = 0; i < charReadingArray.length; i++) {
            const [char, afterChar] = readChar(remainingString, charReadingArray[i]);
            remainingString = afterChar;
        }
        return [charReadingArray, remainingString];
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
function isNextChars(data, chars) {
    if (chars.length === 0) {
        throw new Error("Cannot check validity of empty char string in data");
    }
    let dataIndex = 0;
    let charsIndex = 0;
    while (dataIndex < data.length && charsIndex < chars.length) {
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
/**
 * Returns if the next non-whitespace string in the data parameter matches the given sequence
 * @param data
 * @param sequence
 * @returns
 */
function isNextSeq(data, sequence) {
    let line = [];
    let index = 0;
    let seqIndex = 0;
    while (index < data.length) {
        if (data[index] === " ") {
            if (line.length === 0) {
                index++;
                continue;
            }
            else {
                break;
            }
        }
        line.push(data[index]);
        index++;
    }
    const str = line.join("");
    return str === sequence;
}
exports.isNextSeq = isNextSeq;
/**
 * Reads the sequence from the string. If the next sequence in the string does not match the given sequence, an error is thrown
 * @param data
 * @param sequence
 * @returns
 */
function readSeq(data, sequence) {
    let line = [];
    let index = 0;
    while (index < data.length) {
        if (data[index] === " ") {
            if (line.length === 0) {
                index++;
                continue;
            }
            else {
                break;
            }
        }
        line.push(data[index]);
        index++;
    }
    const str = line.join("");
    if (str === sequence) {
        return [str, index < data.length ? data.substring(index) : ""];
    }
    throw new Error("");
}
exports.readSeq = readSeq;
/**
 * Reads the next line from the string. If the next line in the string is not available (i.e. the data parameter is empty), an error is thrown
 * @param data
 * @param sequence
 * @returns
 */
function readLine(data) {
    let line = [];
    let index = 0;
    while (index < data.length && data[index] !== "\n") {
        line.push(data[index]);
        index++;
    }
    if (data[index] === "\n") {
        index++;
    }
    if (line.length === 0) {
        throw new Error("");
    }
    return [line.join(""), index < data.length ? data.substring(index) : ""];
}
exports.readLine = readLine;
/**
 * Reads the next string of non whitespace characters from the data as a number. If the next string of non whitespace characters does not convert to a number, an error is thrown
 * @param data
 * @returns
 */
function readNumber(data) {
    const [numstr, stream] = readNext(data);
    if ((0, util_1.isNumericString)(numstr)) {
        const num = Number(numstr);
        if (!isNaN(num)) {
            return [num, stream];
        }
        throw new Error("");
    }
    throw new Error("");
}
exports.readNumber = readNumber;
function readDecimal(data) {
    const [num, stream] = readNumber(data);
    if (!Number.isInteger(num)) {
        return [num, stream];
    }
    throw new Error("Cannot read Decimal");
}
exports.readDecimal = readDecimal;
function readInteger(data) {
    const [num, stream] = readNumber(data);
    if (Number.isInteger(num)) {
        return [num, stream];
    }
    throw new Error("Cannot read Integer");
}
exports.readInteger = readInteger;
function readPositiveInteger(data) {
    const [num, stream] = readInteger(data);
    if (num > 0) {
        return [num, stream];
    }
    throw new Error("Cannot read positive integer");
}
exports.readPositiveInteger = readPositiveInteger;
function readNegativeInteger(data) {
    const [num, stream] = readInteger(data);
    if (num < 0) {
        return [num, stream];
    }
    throw new Error("Cannot read negative integer");
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
        const [number, afterRead] = readNumber(data);
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
 * Reads the next string of non whitespace characters from the data. If the next string of non whitespace characters cannot be found, an error is thrown
 * @param data
 * @returns
 */
function readNext(data) {
    let line = [];
    let index = 0;
    while (index < data.length) {
        if (data[index] === " ") {
            if (line.length === 0) {
                index++;
                continue;
            }
            else {
                return [line.join(""), index < data.length ? data.substring(index) : ""];
            }
        }
        line.push(data[index]);
        index++;
    }
    if (line.length === 0) {
        throw new Error();
    }
    return [line.join(""), index < data.length ? data.substring(index) : ""];
}
exports.readNext = readNext;
