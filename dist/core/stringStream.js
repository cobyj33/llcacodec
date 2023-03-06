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
exports.readNext = exports.readNumber = exports.readLine = exports.readSeq = exports.isNextSeq = exports.readChar = exports.isNextChar = void 0;
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
        if (isNaN(num)) {
            return [num, stream];
        }
        throw new Error("");
    }
    throw new Error("");
}
exports.readNumber = readNumber;
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
