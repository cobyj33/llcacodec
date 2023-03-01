
export class StringStream {
    private readonly charBuffer: string;
    private _index: number = 0;

    get index() {
        return this._index
    }

    get remainingCharacters() {
        return this.charBuffer.length - this._index;
    }

    get inputLength() {
        return this.charBuffer.length;
    }

    constructor(str: string) {
        this.charBuffer = str
    }


    isFinished(): boolean {
        return this._index >= this.charBuffer.length
    }

    isEOL(): boolean {
        return this.charBuffer[this._index] === "\n"
    }

    readNextNotWhiteSpaceChar() {
        while (!this.isFinished() && this.charBuffer[this._index] !== "\n") {
            if (this.charBuffer[this._index] === " ") {
                continue;
            }
            return this.charBuffer[this._index]
        }
        return "\0"
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

    readLine(): string {
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