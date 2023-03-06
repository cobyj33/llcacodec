
/**
 * An abstraction to treat a string as a parsed stream of characters
 * 
 * Inspired from Java Scanner and C++ std::stringstream
 * 
 * StringStream's philosophy is to provide an easier API to make operating on string data formats easier through abstracting away common operations like reading lines, reading the next word, and querying if certain patterns appear in order
 * 
 */

import { isNumericString } from "./util";

/**
 * Reads the next non white-space character from the string
 * If a char is specified, the next non white-space character must be that character or else an error is thrown
 * @param data The string to read a character from
 * @returns {[string, string]} where the first value is the read character and the second value is the remaining data string
 */
export function isNextChar(data: string, char: string): boolean {
    if (char.length !== 1) {
        throw new Error("")
    } 
    if (char === " ") {
        throw new Error("unimplemented") 
    }

    let index = 0;
    while (index < data.length) {
        if (data[index] !== " ") {
            return data[index] === char
        }
        index++;
    }
    throw new Error("")
}


/**
 * Reads the next non white-space character from the string
 * If a char is specified, the next non white-space character must be that character or else an error is thrown
 * @param data The string to read a character from
 * @returns {[string, string]} where the first value is the read character and the second value is the remaining data string
 */
export function readChar(data: string, char: string = ""): [string, string] {
    if (char.length > 1) {
        throw new Error("")
    } 
    if (char === " ") {
        throw new Error("unimplemented") 
    }

    let index = 0;
    while (index < data.length) {
        if (data[index] !== " ") {
            return [data[index], index + 1 < data.length ? data.substring(index + 1) : ""]
        }
        index++;
    }
    throw new Error("")
}


/**
 * Returns if the next non-whitespace string in the data parameter matches the given sequence
 * @param data 
 * @param sequence 
 * @returns 
 */
export function isNextSeq(data: string, sequence: string): boolean {
    let line: string[] = []
    let index = 0;
    let seqIndex = 0;
    while (index < data.length) {
        if (data[index] === " ") {
            if (line.length === 0) {
                index++;
                continue;
            } else {
                break;
            }
        }

        line.push(data[index])
        index++;
    }

    const str = line.join("")
    return str === sequence
}

/**
 * Reads the sequence from the string. If the next sequence in the string does not match the given sequence, an error is thrown
 * @param data 
 * @param sequence 
 * @returns 
 */
export function readSeq(data: string, sequence: string): [string, string] {
    let line: string[] = []
    let index = 0;
    while (index < data.length) {
        if (data[index] === " ") {
            if (line.length === 0) {
                index++;
                continue;
            } else {
                break;
            }
        }

        line.push(data[index])
        index++;
    }

    const str = line.join("")
    if (str === sequence) {
        return [str, index < data.length ? data.substring(index) : ""];
    }
    throw new Error("")
}

/**
 * Reads the next line from the string. If the next line in the string is not available (i.e. the data parameter is empty), an error is thrown
 * @param data 
 * @param sequence 
 * @returns 
 */
export function readLine(data: string): [string, string] {
    let line: string[] = []
    let index = 0;
    while (index < data.length && data[index] !== "\n") {
        line.push(data[index])
        index++;
    }

    if (data[index] === "\n") {
        index++;
    }

    if (line.length === 0) {
        throw new Error("")
    }

    return [line.join(""), index < data.length ? data.substring(index) : ""];
}

/**
 * Reads the next string of non whitespace characters from the data as a number. If the next string of non whitespace characters does not convert to a number, an error is thrown
 * @param data 
 * @returns 
 */
export function readNumber(data: string): [number, string] {
    const [numstr, stream] = readNext(data)
    if (isNumericString(numstr)) {
        const num = Number(numstr) 
        if (isNaN(num)) {
            return [num, stream];
        } 
        throw new Error("")
    }
    throw new Error("")
}

/**
 * Reads the next string of non whitespace characters from the data. If the next string of non whitespace characters cannot be found, an error is thrown
 * @param data 
 * @returns 
 */
export function readNext(data: string): [string, string] {
    let line: string[] = []
    let index = 0;
    while (index < data.length) {
        if (data[index] === " ") {
            if (line.length === 0) {
                index++;
                continue;
            } else {
                return [line.join(""), index < data.length ? data.substring(index) : ""];
            }
        }

        line.push(data[index])
        index++;
    }

    if (line.length === 0) {
        throw new Error();
    }

    return [line.join(""), index < data.length ? data.substring(index) : ""];
}   