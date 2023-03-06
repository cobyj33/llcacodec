/**
 * An abstraction to treat a string as a parsed stream of characters
 *
 * Inspired from Java Scanner and C++ std::stringstream
 *
 * StringStream's philosophy is to provide an easier API to make operating on string data formats easier through abstracting away common operations like reading lines, reading the next word, and querying if certain patterns appear in order
 *
 */
/**
 * Reads the next non white-space character from the string
 * If a char is specified, the next non white-space character must be that character or else an error is thrown
 * @param data The string to read a character from
 * @returns {[string, string]} where the first value is the read character and the second value is the remaining data string
 */
export declare function isNextChar(data: string, char: string): boolean;
/**
 * Reads the next non white-space character from the string
 * If a char is specified, the next non white-space character must be that character or else an error is thrown
 * @param data The string to read a character from
 * @returns {[string, string]} where the first value is the read character and the second value is the remaining data string
 */
export declare function readChar(data: string, char?: string): [string, string];
/**
 *
 * @param data the data string to read from
 * @param charOrCount Either a string of the characters in a row to read, or the number of characters to read
 * @returns
 */
export declare function readChars(data: string, charOrCount: string | number): [string[], string];
export declare function isNextChars(data: string, chars: string): boolean;
/**
 * Returns if the next non-whitespace string in the data parameter matches the given sequence
 * @param data
 * @param sequence
 * @returns
 */
export declare function isNextSeq(data: string, sequence: string): boolean;
/**
 * Reads the sequence from the string. If the next sequence in the string does not match the given sequence, an error is thrown
 * @param data
 * @param sequence
 * @returns
 */
export declare function readSeq(data: string, sequence: string): [string, string];
/**
 * Reads the next line from the string. If the next line in the string is not available (i.e. the data parameter is empty), an error is thrown
 * @param data
 * @param sequence
 * @returns
 */
export declare function readLine(data: string): [string, string];
/**
 * Reads the next string of non whitespace characters from the data as a number. If the next string of non whitespace characters does not convert to a number, an error is thrown
 * @param data
 * @returns
 */
export declare function readNumber(data: string): [number, string];
export declare function readDecimal(data: string): [number, string];
export declare function readInteger(data: string): [number, string];
export declare function readPositiveInteger(data: string): [number, string];
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
 * Reads the next string of non whitespace characters from the data. If the next string of non whitespace characters cannot be found, an error is thrown
 * @param data
 * @returns
 */
export declare function readNext(data: string): [string, string];
//# sourceMappingURL=stringStream.d.ts.map