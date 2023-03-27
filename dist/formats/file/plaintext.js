"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isPlainTextDiagram = exports.readPlainTextDiagramToMatrix = exports.readPlainTextDiagramToXY = exports.readPlainTextString = exports.isPlainTextString = exports.writePlainTextMatrix = exports.writePlainTextFromCoordinates = void 0;
const util_1 = require("../../core/util");
const strRead_1 = require("../../core/strRead");
const VALID_DEAD_CELL_CHARACTERS = ["."];
const VALID_LIVE_CELL_CHARACTERS = ["O", "*"];
// --------------------------------------------------------------
// --------------------------------------------------------------
// --------------------------------------------------------------
// ------------------------- WRITING ----------------------------
// --------------------------------------------------------------
// --------------------------------------------------------------
// --------------------------------------------------------------
function writePlainTextMetadata(byteArray, name, description) {
    const newArray = [...byteArray];
    (0, util_1.pushASCIIBytes)(newArray, "!Name: " + name + "\n");
    if (description.length > 0) {
        if (typeof (description) === "string") {
            const lines = description.replace("\r", "").split("\n");
            lines.forEach(line => (0, util_1.pushASCIIBytes)(newArray, `!${line}\n`));
        }
        else {
            const lines = description.flatMap(lines => lines.split("\n"));
            lines.forEach(line => (0, util_1.pushASCIIBytes)(newArray, `!${line}\n`));
        }
    }
    (0, util_1.pushASCIIBytes)(newArray, "!\n");
    return newArray;
}
function writePlainTextFromCoordinates(positions, name, description) {
    for (let i = 0; i < positions.length; i++) {
        if (!Number.isInteger(positions[i][0]) || !Number.isInteger(positions[i][1])) {
            throw new Error(`Attempted to write plain text with Invalid Coordinates: Coordinates must all be integers (Error at coordinate #${i} x: ${positions[i][0]} y: ${positions[i][1]} `);
        }
    }
    return writePlainTextMatrix((0, util_1.numberPairArrayToMatrix)(positions), name, description);
}
exports.writePlainTextFromCoordinates = writePlainTextFromCoordinates;
function writePlainTextMatrix(data, name, description) {
    const byteArray = writePlainTextMetadata([], name, description);
    const height = data.length;
    const width = Math.max(...data.map(row => row.length));
    for (let row = 0; row < height; row++) {
        for (let col = 0; col < width; col++) {
            if (col >= data[row].length) {
                (0, util_1.pushASCIIBytes)(byteArray, ".");
            }
            else {
                (0, util_1.pushASCIIBytes)(byteArray, data[row][col] === 0 ? "." : "O");
            }
        }
        (0, util_1.pushASCIIBytes)(byteArray, "\n");
    }
    return (0, util_1.byteArrayAsASCII)(byteArray);
}
exports.writePlainTextMatrix = writePlainTextMatrix;
// --------------------------------------------------------------
// --------------------------------------------------------------
// --------------------------------------------------------------
// ------------------------- READING ----------------------------
// --------------------------------------------------------------
// --------------------------------------------------------------
// --------------------------------------------------------------
function isPlainTextString(str) {
    try {
        readPlainTextString(str);
        return true;
    }
    catch (e) {
        return false;
    }
}
exports.isPlainTextString = isPlainTextString;
function readPlainTextString(str) {
    if (str.length === 0) {
        throw new Error("");
    }
    const lines = str.replace("\r", "").split("\n").map(line => line.trim());
    if (lines.length === 0) {
        throw new Error("");
    }
    const contents = {
        name: "",
        description: [],
        matrix: [],
        liveCoordinates: []
    };
    //reads header line
    if ((0, strRead_1.isNextChar)(lines[0], "!")) {
        const [, afterHeaderExclamation] = (0, strRead_1.readChar)(lines[0], "!");
        if ((0, strRead_1.isNextChars)(afterHeaderExclamation, "Name:")) {
            contents.name = (0, strRead_1.readChars)(afterHeaderExclamation, "Name:")[1].trim();
        }
        else {
            contents.name = afterHeaderExclamation.trim();
        }
    }
    else {
        const trimmedStr = str.trim();
        if (isPlainTextDiagram(trimmedStr)) {
            return {
                name: "",
                description: [],
                matrix: readPlainTextDiagramToMatrix(trimmedStr),
                liveCoordinates: readPlainTextDiagramToXY(trimmedStr)
            };
        }
        throw new Error("");
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
    if (isPlainTextDiagram(diagramLines)) {
        contents.liveCoordinates = readPlainTextDiagramToXY(diagramLines);
        contents.matrix = readPlainTextDiagramToMatrix(diagramLines);
    }
    else {
        throw new Error(`[llcacodec::readPlainTextString could not read final section of PlainText string as PlainText diagram]`);
    }
    return contents;
}
exports.readPlainTextString = readPlainTextString;
function readPlainTextDiagramToXY(str) {
    if (isPlainTextDiagram(str)) {
        const lines = str.split("\n");
        return lines.flatMap((line, row) => line.split("").map((char, col) => VALID_LIVE_CELL_CHARACTERS.some(valid => valid === char) ? [col, -row] : []).filter(point => point.length > 0));
    }
    throw new Error("error");
}
exports.readPlainTextDiagramToXY = readPlainTextDiagramToXY;
function readPlainTextDiagramToMatrix(str) {
    if (isPlainTextDiagram(str)) {
        const lines = (0, util_1.trimTrailing)(str, "\n").split("\n");
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
                else if (line[i] !== " ") {
                    throw new Error();
                }
            }
            return newLine;
        });
    }
    throw new Error("");
}
exports.readPlainTextDiagramToMatrix = readPlainTextDiagramToMatrix;
function isPlainTextDiagram(line) {
    return line.split("").every(char => VALID_DEAD_CELL_CHARACTERS.some(ch => ch === char) || VALID_LIVE_CELL_CHARACTERS.some(ch => ch === char) || char === " " || char === "\n");
}
exports.isPlainTextDiagram = isPlainTextDiagram;
