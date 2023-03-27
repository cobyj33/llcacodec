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
/**
 * @brief Checks if the next non white-space character from the string matches the given character
 *
 * If a char is specified, the next non white-space character must be that character or else an error is thrown
 *
 * @param data The string to read a character from
 * @param char A character to read. This string must have a length of 1 and must NOT be whitespace
 * @returns {boolean} If the next character in the given data string matches the provided character
 */
export declare function isNextChar(data: string, char: string): boolean;
/**
 * @brief Reads the next non white-space character from the string
 *
 * @note This function will read special characters line newlines and carriage returns
 *
 * @param data The string to read a character from
 * @returns {[string, string]} where the first value is the read character and the second value is the remaining data string
 * @throws If a character could not be read. IE: The provided data string is only whitespace
 */
export declare function readChar(data: string): [string, string];
/**
 * @brief Reads the next provided character from the string the next non-whitespace character must be that character or else an error is thrown
 *
 * @param data The string to read a character from
 * @param char The character to read. This character must have a length of either 0 or 1 and must **NOT** be a whitespace character.
 * If no character is given, readChar will simply read the next non-whitespace character
 * @returns {[string, string]} where the first value is the read character and the second value is the remaining data string
 * @throws If the provided char does not have a length of 1, If the provided char is a whitespace character, or if the character could not be read
 */
export declare function readChar(data: string, char: string): [string, string];
/**
 * @brief read characters from a data string
 *
 * @param data the data string to read from
 * @param count The number of characters to read from the string
 * @returns {[string[], string]} A tuple, where the first entry is the returned read characters and the second entry is the remaining string after reading the characters.
 */
export declare function readChars(data: string, count: number): [string[], string];
/**
 * @brief read characters from a data string
 *
 * @param data the data string to read from
 * @param charsToRead A string of characters to read from the given data string sequentially
 * @returns {[string[], string]} A tuple, where the first entry is the returned read characters and the second entry is the remaining string after reading the characters.
 * The returned first entry will be an array of the passed in charsToRead
 */
export declare function readChars(data: string, charsToRead: string): [string[], string];
/**
 * @brief Determine if the next non-whitespace characters available in the data string follow the provided sequence
 *
 * @param data The data string to validate against
 * @param chars The characters
 * @returns {boolean} whether the next non-whitespace characters found in the string follow the provided sequence
 * @throws If any whitespace is passed into the "chars" string
 * @throws If the length of the passed in characters is 0
 */
export declare function isNextChars(data: string, chars: string): boolean;
/**
 * @brief Reads the next line from the string.
 * @note The newline character is not retained in the returned line.
 * @param data The data string to read from
 * @returns {[string, string]} A tuple where the first entry is the line read from the string and the second entry is the remaining data in the data string
 * @throws If the next line in the string is not available (i.e. the data parameter is empty), an error is thrown
 */
export declare function readLine(data: string): [string, string];
/**
 * @brief Reads the next string of non whitespace characters from the data as a number.
 * @param data The data string to read from
 * @returns {[string, string]} A tuple, where the first entry is the number read from the string and the second entry is the remaining string after reading
 * @throws If the next string of non whitespace characters does not convert to a number
 */
export declare function readNumber(data: string): [number, string];
/**
 * @brief Reads the next sequence of non whitespace characters from the data as a float. The number MUST be a float value or else an error is thrown
 * @param data The data string to read from
 * @returns {[string, string]} A tuple, where the first entry is the float read from the string and the second entry is the remaining string after reading
 * @throws If the next string of non whitespace characters does not convert to a number
 * @throws If the next string of non whitespace characters is a number, but is not a float
 */
export declare function readFloat(data: string): [number, string];
/**
 * @brief Reads the next sequence of non whitespace characters from the data as a integer. The number MUST be a integer value or else an error is thrown
 * @param data The data string to read from
 * @returns {[string, string]} A tuple, where the first entry is the integer read from the string and the second entry is the remaining string after reading
 * @throws If the next string of non whitespace characters does not convert to a number
 * @throws If the next string of non whitespace characters is a number, but is not an integer
 */
export declare function readInteger(data: string): [number, string];
/**
 * @brief Reads the next sequence of non whitespace characters from the data as a positive integer. The number MUST be a positive integer value or else an error is thrown
 * @param data The data string to read from
 * @returns {[string, string]} A tuple, where the first entry is the positive integer read from the string and the second entry is the remaining string after reading
 * @throws If the next string of non whitespace characters does not convert to a number
 * @throws If the next string of non whitespace characters is a number, but is not a positive integer
 */
export declare function readPositiveInteger(data: string): [number, string];
/**
 * @brief Reads the next sequence of non whitespace characters from the data as a negative integer. The number MUST be a negative integer value or else an error is thrown
 * @param data The data string to read from
 * @returns {[string, string]} A tuple, where the first entry is the negative integer read from the string and the second entry is the remaining string after reading
 * @throws If the next string of non whitespace characters does not convert to a number
 * @throws If the next string of non whitespace characters is a number, but is not a negative integer
 */
export declare function readNegativeInteger(data: string): [number, string];
export declare function readNumbers(data: string, numOfNums: number): [number[], string];
export declare function readIntegers(data: string, numOfIntegers: number): [number[], string];
/**
 * Reads the next string of any representation of a number, ignoring white-space.
 * Only works with
 * @param data
 * @returns
 */
export declare function readCrampedNumber(data: string): [number, string];
export declare function readCrampedInteger(data: string): [number, string];
export declare function readCrampedPositiveInteger(data: string): [number, string];
/**
 * @brief Reads the next sequence of non whitespace characters from the data.
 * If the next string of non whitespace characters cannot be found, an error is thrown
 * @param data The data string to read from
 * @returns {[string, string]} A tuple where the first entry is the next string of non-whitespace characters found in the provided data,
 * and the second entry is the remaining data after reading
 * @throws If the next string of non whitespace characters cannot be found. (IE: The given string is empty or only contains whitespace)
 */
export declare function readNext(data: string): [string, string];
//# sourceMappingURL=strRead.d.ts.map