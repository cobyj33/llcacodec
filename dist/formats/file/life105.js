"use strict";
// Life 1.05 File Format Spec: https://conwaylife.com/wiki/Life_1.05
Object.defineProperty(exports, "__esModule", { value: true });
exports.readLife105String = exports.isLife105String = void 0;
const util_1 = require("../../core/util");
const strRead_1 = require("../../core/strRead");
const rule_1 = require("../rule");
const LIFE_105_HEADER = "#Life 1.05";
const MAX_DESCRIPTION_LINE_COUNT = 22;
const LIFE_105_MAX_LINE_LENGTH = 80;
const Life105FileExtensions = [".lif", ".life"];
const LIFE_105_DEAD_CHAR = ".";
const LIFE_105_ALIVE_CHAR = "*";
function isLife105CellBlock(data) {
    if (!(0, strRead_1.isNextChars)(data, "#P")) {
        return false;
    }
    const [pointLine, afterPointLine] = (0, strRead_1.readLine)(data);
    const [, afterPointDeclaration] = (0, strRead_1.readChars)(pointLine, "#P");
    const [[x, y]] = (0, strRead_1.readIntegers)(afterPointDeclaration, 2);
    const trimmedPatternLines = afterPointLine.split("\n").map(line => line.trim());
    for (let i = 0; i < trimmedPatternLines.length; i++) {
        for (let j = 0; j < trimmedPatternLines[i].length; j++) {
            if (!(trimmedPatternLines[i][j] === LIFE_105_DEAD_CHAR || trimmedPatternLines[i][j] === LIFE_105_ALIVE_CHAR)) {
                return false;
            }
        }
    }
    return true;
}
function readLife105CellBlock(data) {
    const trimmedLines = data.split("\n").map(line => line.trim());
    const pointLine = trimmedLines[0];
    const [, afterPointDeclaration] = (0, strRead_1.readChars)(pointLine, "#P");
    const [[x, readY]] = (0, strRead_1.readIntegers)(afterPointDeclaration, 2);
    const y = -readY; // positive y is down for life 1.05, so I flip it for compatibility with llcacodec where positive y is up
    let i = 1;
    const liveCoordinates = [];
    while (i < trimmedLines.length && !(0, strRead_1.isNextChars)(trimmedLines[i], "#P")) {
        for (let j = 0; j < trimmedLines[i].length; j++) {
            if (trimmedLines[i][j] === LIFE_105_ALIVE_CHAR) {
                liveCoordinates.push([x + j, y - (i - 1)]);
            }
        }
        i++;
    }
    const matrix = (0, util_1.numberPairArrayToMatrix)(liveCoordinates);
    return {
        x: x,
        y: y,
        width: matrix[0].length,
        height: matrix.length,
        pattern: matrix,
        liveCoordinates: liveCoordinates
    };
}
function extractLife105CellBlockStrings(data) {
    const lines = data.trim().split("\n");
    const cellBlockStrings = [];
    let cellBlockStart = -1;
    for (let i = 0; i < lines.length; i++) {
        if ((0, strRead_1.isNextChars)(lines[i].trim(), "#P")) {
            if (cellBlockStart !== -1) {
                cellBlockStrings.push(lines.slice(cellBlockStart, i).join("\n"));
            }
            cellBlockStart = i;
        }
    }
    if (cellBlockStart !== -1) {
        cellBlockStrings.push(lines.slice(cellBlockStart, lines.length).join("\n"));
    }
    return cellBlockStrings;
}
function isLife105String(file) {
    return file.trim().startsWith(LIFE_105_HEADER);
}
exports.isLife105String = isLife105String;
function readLife105String(file) {
    file = file.replace("\r", "");
    const life105FileData = {
        format: "life 1.05",
        cellBlocks: [],
        liveCoordinates: [],
        descriptions: [],
        ruleString: rule_1.CONWAY_RULE_STRING_SB,
        rule: (0, rule_1.CONWAY_LIFE_RULE_DATA)(),
        hashLines: []
    };
    const lines = file.split("\n");
    const headerLine = lines[0];
    if (!headerLine.trim().startsWith(LIFE_105_HEADER)) {
        throw new Error(`[llcacodec::readLife105String given Life105String does not begin with the required Life 1.05 header "#Life 1.05"]`);
    }
    let currentLineIndex = 1;
    while ((0, strRead_1.isNextChar)(lines[currentLineIndex], "#")) {
        const [, afterHash] = (0, strRead_1.readChar)(lines[currentLineIndex], "#");
        const [id, afterID] = (0, strRead_1.readChar)(afterHash);
        const trimmedContent = afterID.trim();
        if (id === "D") {
            life105FileData.descriptions.push(trimmedContent);
        }
        else if (id === "R") {
            life105FileData.ruleString = trimmedContent;
            life105FileData.rule = (0, rule_1.readLifeRule)(trimmedContent);
        }
        else if (id === "N") {
            life105FileData.ruleString = rule_1.CONWAY_RULE_STRING_SB;
            life105FileData.rule = (0, rule_1.CONWAY_LIFE_RULE_DATA)();
        }
        else if (id === "P") { // encountered beginning of Cell Block Data
            break;
        }
        life105FileData.hashLines.push({
            id: id,
            content: trimmedContent,
            full: lines[currentLineIndex].trim()
        });
        currentLineIndex++;
    }
    const cellBlockStrings = extractLife105CellBlockStrings(lines.slice(currentLineIndex).join("\n"));
    for (let i = 0; i < cellBlockStrings.length; i++) {
        const cellBlock = readLife105CellBlock(cellBlockStrings[i]);
        life105FileData.cellBlocks.push(cellBlock);
        life105FileData.liveCoordinates.push(...cellBlock.liveCoordinates);
    }
    life105FileData.liveCoordinates = (0, util_1.uniqueNumberPairArray)(life105FileData.liveCoordinates);
    return life105FileData;
}
exports.readLife105String = readLife105String;
// function writeLife105String()
