
/**
 * An abstraction to treat a string as a parsed stream of characters
 * 
 * Inspired from Java Scanner and C++ std::stringstream
 * 
 * StringStream's philosophy is to provide an easier API to make operating on string data formats easier through abstracting away common operations like reading lines, reading the next word, and querying if certain patterns appear in order
 * 
 */

export class StringStream {
    /**
     * The internal string that was inputted onto the object during creation. This never changes for the entirety of a StringStream's lifetime
     */
    private readonly charBuffer: string;

    /**
     * The current position of a StringStream object. This value never decrements as a way to simulate continuous reading from an I/O stream
     */
    private _index: number = 0;

    get index() {
        return this._index
    }

    get remainingCharacters() {
        return this.charBuffer.length - this._index;
    }

    /**
     * The length of the inputted string object upon the StringStream's creation
     * 
     * I opted on using the name "inputLength" over the standard "length" because "length" could be confused for either the remaining length or the total original length.
     */
    get inputLength() {
        return this.charBuffer.length;
    }

    /**
     * Uses the inputted string as the stream data to operate on
     * @param str the string for the StringStream object to operate on
     */
    constructor(str: string) {
        this.charBuffer = str
    }

    /**
     * Find if the stream has finished with it's reading of the inputted data and there is no more data to iterate over
     * @returns If the stream has been completed
     */
    isFinished(): boolean {
        return this._index >= this.charBuffer.length
    }

    /**
     * Find if the stream is positioned at the end of a line. This is true if the current loaded character in the stream is a newline character (\n)
     * @returns If the stream is positioned at the end of a line
     */
    isEOL(): boolean {
        return this.charBuffer[this._index] === "\n"
    }

    readNextNotWhiteSpaceChar(): string {
        while (!this.isFinished() && this.charBuffer[this._index] !== "\n") {
            if (this.charBuffer[this._index] === " ") {
                continue;
            }
            return this.charBuffer[this._index]
        }
        throw new Error("")
    }

    advance() {
        if (this.isFinished()) {
            throw new Error()
        }

        this._index++;
    }

    readChar() {
        if (this.isFinished()) {
            throw new Error()
        }
        const char = this.charBuffer[this._index]
        this._index++;
        return char;
    }

    readNumber() {

    }

    /**
     * 
     * @returns 
     */
    readNextNotWhiteSpaceSection() {
        let line: string[] = []
        while (!this.isFinished() && this.charBuffer[this._index] !== "\n") {
            if (this.charBuffer[this._index] === " " && line) {
                if (line.length === 0) {
                    this._index++;
                    continue;
                } else {
                    return line.join("");
                }
            }

            line.push(this.charBuffer[this._index])
            this._index++;
        }

        if (this.charBuffer[this._index] === "\n") {
            this._index++;
        }
    }

    /**
     * Reads up to the next newline character and discards the next newline character, returning the characters before the next newline character and positioning the stream after the next newline character
     * @returns A string containing of all data until the next found newline character
     */
    readLine(): string {
        if (this.isFinished()) {
            throw new Error(`StringStream Error: Cannot read line from a finished stream`)
        }
        
        let line: string[] = []
        while (!this.isFinished() && this.charBuffer[this._index] !== "\n") {
            line.push(this.charBuffer[this._index])
            this._index++;
        }

        if (this.charBuffer[this._index] === "\n") {
            this._index++;
        }

        return line.join("");
    }
}