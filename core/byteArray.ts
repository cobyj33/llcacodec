

export class ByteArray {
    private data: number[]

    constructor() {
      this.data = []
    }
  
    getData() : Uint8ClampedArray {
      return Uint8ClampedArray.from(this.data)
    }

    getString(): string {
        return this.data.map(val => String.fromCharCode(val)).join("")
    }
  
    writeByte(val: number): void {
      this.data.push(val)
    }
  
    writeUTFBytes(str: string): void {
      for (var len = str.length, i = 0; i < len; i++) {
        this.writeByte(str.charCodeAt(i))
      }
    }
  
    writeBytes(array: number[]): void {
        array.forEach(num => this.writeByte(num))
    }
}