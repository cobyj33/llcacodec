
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

import { isDigit, isNumericString } from "./util";

/**
 * @brief Checks if the next non white-space character from the string matches the given character
 * 
 * If a char is specified, the next non white-space character must be that character or else an error is thrown
 * 
 * @param data The string to read a character from
 * @param char A character to read. This string must have a length of 1 and must NOT be whitespace 
 * @returns {boolean} If the next character in the given data string matches the provided character
 */
export function isNextChar(data: string, char: string): boolean {
    if (char.length !== 1) {
        throw new Error(`[llcacodec::isNextChar Cannot query for next ${char.length} length character. Character must have a length of 1`)
    } 
    if (char === " ") {
        throw new Error(`[llcacodec::isNextChar Cannot query for next whitespace character`) 
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
 * @brief Reads the next non white-space character from the string
 * 
 * @note This function will read special characters line newlines and carriage returns
 * 
 * @param data The string to read a character from
 * @returns {[string, string]} where the first value is the read character and the second value is the remaining data string
 * @throws If a character could not be read. IE: The provided data string is only whitespace
 */
export function readChar(data: string): [string, string]

/**
 * @brief Reads the next provided character from the string the next non-whitespace character must be that character or else an error is thrown
 * 
 * @param data The string to read a character from
 * @param char The character to read. This character must have a length of either 0 or 1 and must **NOT** be a whitespace character.
 * If no character is given, readChar will simply read the next non-whitespace character
 * @returns {[string, string]} where the first value is the read character and the second value is the remaining data string
 * @throws If the provided char does not have a length of 1, If the provided char is a whitespace character, or if the character could not be read
 */
export function readChar(data: string, char: string): [string, string]
export function readChar(data: string, char: string = ""): [string, string] {
    if (char.length > 1) {
        throw new Error(`[llcacodec::readChar Cannot read next ${char.length} length character. Character must have a length of 1]`)
    } 
    if (char === " ") {
        throw new Error(`[llcacodec::readChar Cannot read whitespace character]`) 
    } 
    if (char === undefined) {
        throw new Error(`[llcacodec::readChar Cannot read undefined]`) 
    }

    let index = 0;
    while (index < data.length) {
        if (data[index] !== " ") {
            if (char !== "" && char !== data[index]) {
                throw new Error(`[llcacodec::readChar Failed to read next character as ${char}, got ${data[index]}]`)
            }
            return [data[index], index + 1 < data.length ? data.substring(index + 1) : ""]
        }
        index++;
    }
    throw new Error("[strRead::readChar] Reached end of string and could not read any next characters")
}


/**
 * @brief read characters from a data string
 * 
 * @param data the data string to read from
 * @param count The number of characters to read from the string
 * @returns {[string[], string]} A tuple, where the first entry is the returned read characters and the second entry is the remaining string after reading the characters.
 */
export function readChars(data: string, count: number): [string[], string]
/**
 * @brief read characters from a data string
 * 
 * @param data the data string to read from
 * @param charsToRead A string of characters to read from the given data string sequentially
 * @returns {[string[], string]} A tuple, where the first entry is the returned read characters and the second entry is the remaining string after reading the characters. 
 * The returned first entry will be an array of the passed in charsToRead
 */
export function readChars(data: string, charsToRead: string): [string[], string]
export function readChars(data: string, charOrCount: string | number): [string[], string] {
    if (typeof(charOrCount) === "string") {
        const charsToRead = charOrCount.split("")
        if (charsToRead.length === 0) {
            throw new Error("Cannot read 0 characters from a string")
        }

        let remainingString = data;
        for (let i = 0; i < charsToRead.length; i++) {
            const [, afterChar] = readChar(remainingString, charsToRead[i])
            remainingString = afterChar
        }
        return [charsToRead, remainingString]
    } else if (typeof(charOrCount) === "number") {
        if (!Number.isInteger(charOrCount)) {
            throw new Error("Cannot read a non-integer amount of characters from a string")
        } else if (charOrCount < 0) {
            throw new Error("Cannot read a negative amount of characters from a string")
        }

        const readChars: string[] = []

        let remainingString = data;
        for (let i = 0; i < charOrCount; i++) {
            const [char, afterChar] = readChar(remainingString)
            remainingString = afterChar
            readChars.push(char)
        }
        return [readChars, remainingString]
    } else {
        throw new Error("Passed in non-string non-number value to charOrCount of readChars")
    }
}

/**
 * @brief Determine if the next non-whitespace characters available in the data string follow the provided sequence
 * 
 * @param data The data string to validate against
 * @param chars The characters
 * @returns {boolean} whether the next non-whitespace characters found in the string follow the provided sequence
 * @throws If any whitespace is passed into the "chars" string
 * @throws If the length of the passed in characters is 0
 */
export function isNextChars(data: string, chars: string): boolean {
    if (chars.length === 0) {
        throw new Error(`[llcacodec::isNextChars Cannot check if next characters in string is empty`)
    }
    
    let dataIndex = 0;
    let charsIndex = 0;
    while (dataIndex < data.length && charsIndex < chars.length) {
        if (chars[charsIndex] === " ") {
            throw new Error(`[llcacodec::isNextChars Cannot check if next character in string is whitespace`)
        }
        if (data[dataIndex] !== " ") {
            if (data[dataIndex] === chars[charsIndex]) {
                charsIndex++;
            } else {
                return false;
            }
        }
        dataIndex++;
    }

    return charsIndex === chars.length
}

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
export function readLine(data: string): [string, string] {
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

/**
 * @brief Reads the next string of non whitespace characters from the data as a number.
 * @param data The data string to read from
 * @returns {[string, string]} A tuple, where the first entry is the number read from the string and the second entry is the remaining string after reading
 * @throws If the next string of non whitespace characters does not convert to a number
 */
export function readNumber(data: string): [number, string] {
    const [numstr, stream] = readNext(data)
    if (isNumericString(numstr)) {
        const num = Number(numstr) 
        if (!isNaN(num)) {
            return [num, stream];
        }
        throw new Error(`[llcacodec::readNumber Number String ${numstr} incorrectly converted to NaN]`)
    }
    throw new Error(`[llcacodec::readNumber Number String ${numstr} is not a numerical string]`)
}

/**
 * @brief Reads the next sequence of non whitespace characters from the data as a float. The number MUST be a float value or else an error is thrown
 * @param data The data string to read from
 * @returns {[string, string]} A tuple, where the first entry is the float read from the string and the second entry is the remaining string after reading
 * @throws If the next string of non whitespace characters does not convert to a number
 * @throws If the next string of non whitespace characters is a number, but is not a float
 */
export function readFloat(data: string): [number, string] {
    const [num, stream] = readNumber(data)
    if (!Number.isInteger(num)) {
        return [num, stream]
    }
    throw new Error(`[llcacodec::readFloat Cannot read Decimal, as returned number is an Integer value]`)
}

/**
 * @brief Reads the next sequence of non whitespace characters from the data as a integer. The number MUST be a integer value or else an error is thrown
 * @param data The data string to read from
 * @returns {[string, string]} A tuple, where the first entry is the integer read from the string and the second entry is the remaining string after reading
 * @throws If the next string of non whitespace characters does not convert to a number
 * @throws If the next string of non whitespace characters is a number, but is not an integer
 */
export function readInteger(data: string): [number, string] {
    const [num, stream] = readNumber(data)
    if (Number.isInteger(num)) {
        return [num, stream]
    }
    throw new Error(`[llcacodec::readInteger Cannot read Decimal, as returned number is a float value]`)
}

/**
 * @brief Reads the next sequence of non whitespace characters from the data as a positive integer. The number MUST be a positive integer value or else an error is thrown
 * @param data The data string to read from
 * @returns {[string, string]} A tuple, where the first entry is the positive integer read from the string and the second entry is the remaining string after reading
 * @throws If the next string of non whitespace characters does not convert to a number
 * @throws If the next string of non whitespace characters is a number, but is not a positive integer
 */
export function readPositiveInteger(data: string): [number, string] {
    const [num, stream] = readInteger(data)
    if (num > 0) {
        return [num, stream]
    }
    throw new Error(`[llcacodec::readPositiveInteger Cannot read Positive Integer, as returned integer is less than 0]`)
}

/**
 * @brief Reads the next sequence of non whitespace characters from the data as a negative integer. The number MUST be a negative integer value or else an error is thrown
 * @param data The data string to read from
 * @returns {[string, string]} A tuple, where the first entry is the negative integer read from the string and the second entry is the remaining string after reading
 * @throws If the next string of non whitespace characters does not convert to a number
 * @throws If the next string of non whitespace characters is a number, but is not a negative integer
 */
export function readNegativeInteger(data: string): [number, string] {
    const [num, stream] = readInteger(data)
    if (num < 0) {
        return [num, stream]
    }
    throw new Error(`[llcacodec::readNegativeInteger Cannot read Negative Integer, as returned integer is greater than 0]`)
}

export function readNumbers(data: string, numOfNums: number): [number[], string] {
    if (numOfNums < 0) {
        throw new Error(`Cannot read a negative amount of numbers`)
    } else if (!Number.isInteger(numOfNums)) {
        throw new Error(`Cannot read a decimal number of numbers`)
    }
    
    const numbers: number[] = []
    let remaining = data;
    for (let i = 0; i < numOfNums; i++) {
        const [number, afterRead] = readNumber(remaining)
        numbers.push(number)
        remaining = afterRead
    }

    return [numbers, remaining]
}

export function readIntegers(data: string, numOfIntegers: number): [number[], string] {
    const [numbers, stream] = readNumbers(data, numOfIntegers)
    if (numbers.every(num => Number.isInteger(num))) {
        return [numbers, stream] 
    }
    throw new Error(`Cannot read ${numOfIntegers} integers: Found non integer values: ${ numbers.map((num, index) => [index, num] as [number, number]).filter(pair => !Number.isInteger(pair[1])) } `)
}

/**
 * Reads the next string of any representation of a number, ignoring white-space.
 * Only works with 
 * @param data 
 * @returns 
 */
export function readCrampedNumber(data: string): [number, string] {
    let hitPoint = false;
    let i = 0;

    let numchars: string[] = []

    while (i < data.length) {
        const char = data[i]
        if (char === " ") {

            if (numchars.length === 0) {
                i++;
                continue;
            } else {
                break;
            }

        } else if (char === "-") {

            if (numchars.length === 0) {
                numchars.push("-")
            } else {
                break
            }

        } else if (char === ".") {
            
            if (hitPoint === false) {
                numchars.push(".")
                hitPoint = true
            } else {
                break
            }

        } else if (isDigit(char)) {
            numchars.push(char)
        } else {

            if (numchars.length === 0) {
                throw new Error(`Could not read cramped number (Encountered invalid char ${char} at index ${i} of string "${data}")`)
            } else {
                break;
            }

        }

        i++
    }

    const numstr = numchars.join("")
    if (isNumericString(numstr)) {
        const num = Number(numstr) 
        if (!isNaN(num)) {
            return [num, i < data.length ? data.substring(i) : ""];
        }
        throw new Error(`Cramped Number read as NaN (got "${numstr}" ) ( passed in: "${data}" )`)
    }

    throw new Error(`Cramped Number not evaluated to numeric string (got ${numstr} ) ( passed in: ${data})`)
}

export function readCrampedInteger(data: string): [number, string] {
    const [num, stream] = readCrampedNumber(data)
    if (Number.isInteger(num)) {
        return [num, stream]
    }
    throw new Error("Cannot read Cramped Integer")
}

export function readCrampedPositiveInteger(data: string): [number, string] {
    const [num, stream] = readCrampedInteger(data)
    if (num > 0) {
        return [num, stream]
    }
    throw new Error("Cannot read positive cramped integer")
}

/**
 * @brief Reads the next sequence of non whitespace characters from the data. 
 * If the next string of non whitespace characters cannot be found, an error is thrown
 * @param data The data string to read from
 * @returns {[string, string]} A tuple where the first entry is the next string of non-whitespace characters found in the provided data,
 * and the second entry is the remaining data after reading
 * @throws If the next string of non whitespace characters cannot be found. (IE: The given string is empty or only contains whitespace)
 */
export function readNext(data: string): [string, string] {
    let index = 0;
    let startIndex = -1;
    while (index < data.length) {

        if (data[index] === " ") {
            if (startIndex === -1) {
                index++;
                continue;
            } else { // note that data[index] is still equal to whitespace
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