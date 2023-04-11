"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isPlaintextDiagram = exports.readPlaintextDiagramToMatrix = exports.readPlaintextDiagramToXY = exports.readPlaintextString = exports.isPlaintextString = exports.writePlaintextString = exports.isPlaintextCoordinateEncodingData = exports.isPlaintextMatrixEncodingData = void 0;
const util_1 = require("../../core/util");
const strRead_1 = require("../../core/strRead");
const VALID_DEAD_CELL_CHARACTERS = ["."];
const VALID_LIVE_CELL_CHARACTERS = ["O", "*"];
function isPlaintextMatrixEncodingData(data) {
    return typeof (data) === "object" && data !== null &&
        "name" in data && "description" in data && "matrix" in data &&
        typeof (data.name) === "string" && (typeof (data.description) === "string" || (0, util_1.isStringArray)(data.description)) &&
        (0, util_1.isCellMatrix)(data.matrix);
}
exports.isPlaintextMatrixEncodingData = isPlaintextMatrixEncodingData;
function isPlaintextCoordinateEncodingData(data) {
    return typeof (data) === "object" && data !== null &&
        "name" in data && "description" in data && "liveCoordinates" in data &&
        typeof (data.name) === "string" && (typeof (data.description) === "string" || (0, util_1.isStringArray)(data.description)) &&
        (0, util_1.isCellCoordinateArray)(data.liveCoordinates);
}
exports.isPlaintextCoordinateEncodingData = isPlaintextCoordinateEncodingData;
// --------------------------------------------------------------
// --------------------------------------------------------------
// --------------------------------------------------------------
// ------------------------- WRITING ----------------------------
// --------------------------------------------------------------
// --------------------------------------------------------------
// --------------------------------------------------------------
function writePlaintextString(data) {
    let matrix = [];
    if ("matrix" in data) {
        matrix = data.matrix;
    }
    else {
        for (let i = 0; i < data.liveCoordinates.length; i++) {
            if (!Number.isInteger(data.liveCoordinates[i][0]) || !Number.isInteger(data.liveCoordinates[i][1])) {
                throw new Error(`Attempted to write plain text with Invalid Coordinates: Coordinates must all be integers (Error at coordinate #${i} x: ${data.liveCoordinates[i][0]} y: ${data.liveCoordinates[i][1]} `);
            }
        }
        matrix = (0, util_1.numberPairArrayToMatrix)(data.liveCoordinates);
    }
    const builder = [];
    builder.push("!Name: " + data.name + "\n");
    if (data.description.length > 0) {
        if (typeof (data.description) === "string") {
            const lines = data.description.replace("\r", "").split("\n");
            lines.forEach(line => builder.push(`!${line}\n`));
        }
        else {
            const lines = data.description.flatMap(lines => lines.split("\n"));
            lines.forEach(line => builder.push(`!${line}\n`));
        }
    }
    builder.push("!\n");
    const height = matrix.length;
    const width = Math.max(...matrix.map(row => row.length));
    for (let row = 0; row < height; row++) {
        for (let col = 0; col < width; col++) {
            if (col >= matrix[row].length) {
                builder.push(".");
            }
            else {
                builder.push(matrix[row][col] === 0 ? "." : "O");
            }
        }
        builder.push("\n");
    }
    return builder.join("");
}
exports.writePlaintextString = writePlaintextString;
// --------------------------------------------------------------
// --------------------------------------------------------------
// --------------------------------------------------------------
// ------------------------- READING ----------------------------
// --------------------------------------------------------------
// --------------------------------------------------------------
// --------------------------------------------------------------
function isPlaintextString(str) {
    try {
        readPlaintextString(str);
        return true;
    }
    catch (e) {
        return false;
    }
}
exports.isPlaintextString = isPlaintextString;
function readPlaintextString(str) {
    if (str.length === 0) {
        throw new Error(`[llcacodec] Attempted to pass in empty string toward Plain Text Decoder`);
    }
    const lines = str.replace("\r", "").split("\n").map(line => line.trim());
    if (lines.length === 0) {
        throw new Error(`[llcacodec] Could not find any unique lines in plain text string "${str}"`);
    }
    const contents = {
        format: "plaintext",
        name: "",
        description: [],
        matrix: [],
        liveCoordinates: []
    };
    //reads header line
    if ((0, strRead_1.isNextChar)(lines[0], "!")) {
        const [, afterHeaderExclamation] = (0, strRead_1.readChar)(lines[0], "!");
        if ((0, strRead_1.isNextChars)(afterHeaderExclamation, "Name:")) {
            const [, afterNameDeclaration] = (0, strRead_1.readChars)(afterHeaderExclamation, "Name:");
            contents.name = afterNameDeclaration.trim();
        }
        else {
            contents.name = afterHeaderExclamation.trim();
        }
    }
    else {
        const trimmedStr = str.trim();
        if (isPlaintextDiagram(trimmedStr)) {
            return {
                format: "plaintext",
                name: "",
                description: [],
                matrix: readPlaintextDiagramToMatrix(trimmedStr),
                liveCoordinates: readPlaintextDiagramToXY(trimmedStr)
            };
        }
        throw new Error(`[llcacodec::readPlaintextString] attempted to read invalid plain text string ${str}. ${str} could neither be determined to be a plaintext string nor a plaintext diagram`);
    }
    //reading description lines
    let currentLine = 1;
    while ((0, strRead_1.isNextChar)(lines[currentLine], "!")) {
        const [, description] = (0, strRead_1.readChar)(lines[currentLine], "!");
        if (description.trim().length > 0) {
            contents.description.push(description.trim());
        }
        currentLine++;
    }
    const diagramLines = lines.slice(currentLine).join("\n");
    if (isPlaintextDiagram(diagramLines)) {
        contents.liveCoordinates = readPlaintextDiagramToXY(diagramLines);
        contents.matrix = readPlaintextDiagramToMatrix(diagramLines);
    }
    else {
        throw new Error(`[llcacodec::readPlaintextString could not read final section of Plaintext string as Plaintext diagram]`);
    }
    return contents;
}
exports.readPlaintextString = readPlaintextString;
function readPlaintextDiagramToXY(str) {
    if (!isPlaintextDiagram(str)) {
        throw new Error(`[llcacodec::readPlaintextDiagramToXY] attempted to read invalid plaintext diagram ${str}`);
    }
    const lines = str.split("\n");
    return lines.flatMap((line, row) => line.split("").map((char, col) => VALID_LIVE_CELL_CHARACTERS.some(valid => valid === char) ? [col, -row] : []).filter(point => point.length > 0));
}
exports.readPlaintextDiagramToXY = readPlaintextDiagramToXY;
function readPlaintextDiagramToMatrix(str) {
    if (!isPlaintextDiagram(str)) {
        throw new Error(`[llcacodec::readPlaintextDiagramToXY] attempted to read invalid plaintext diagram ${str}`);
    }
    const lines = str.trim().replace("\r", "").split("\n");
    const width = Math.max(...lines.map(line => line.length));
    return lines.map(line => {
        const newLine = new Array(width);
        for (let i = 0; i < width; i++) {
            if (i >= line.length) {
                newLine[i] = 0;
            }
            else if (VALID_LIVE_CELL_CHARACTERS.some(ch => ch === line[i])) {
                newLine[i] = 1;
            }
            else if (VALID_DEAD_CELL_CHARACTERS.some(ch => ch === line[i])) {
                newLine[i] = 0;
            }
            else if (line[i] !== " " && line[i] !== "\r") {
                throw new Error(`[llcacodec::readPlaintextDiagramToMatrix Found invalid character (UTF-8 code: ${line[i].charCodeAt(0)})`);
            }
        }
        return newLine;
    });
}
exports.readPlaintextDiagramToMatrix = readPlaintextDiagramToMatrix;
function isPlaintextDiagram(line) {
    return line.split("").every(char => VALID_DEAD_CELL_CHARACTERS.some(ch => ch === char) ||
        VALID_LIVE_CELL_CHARACTERS.some(ch => ch === char) ||
        char === " "
        || char === "\n"
        || char === "\r");
}
exports.isPlaintextDiagram = isPlaintextDiagram;
