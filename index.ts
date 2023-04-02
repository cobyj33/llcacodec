import { readLife106String, writeLife106String } from "./src/formats/file/life106"
import { writePlaintextFromCoordinates, writePlaintextMatrix } from "./src/formats/file/plaintext"

const life106String = writeLife106String([[0, 1], [1, 2], [2, 3], [3, 4]])
console.log(life106String)
console.log(readLife106String(life106String))

const plainTextString = writePlaintextFromCoordinates([[0, 1], [1, 2], [2, 3], [3, 4]], "Steps", "")
console.log(plainTextString)