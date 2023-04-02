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
function readLife105CellBlock(data) {
    data = data.trim();
    if ((0, strRead_1.isNextChars)(data, "#P")) {
        const cellBlock = {
            x: 0,
            y: 0,
            width: 0,
            height: 0,
            pattern: [],
            liveCoordinates: []
        };
        const [pointLine, afterPointLine] = (0, strRead_1.readLine)(data);
        const [, afterPointDeclaration] = (0, strRead_1.readChars)(pointLine, "#P");
        const [[x, y]] = (0, strRead_1.readIntegers)(afterPointDeclaration, 2);
        cellBlock.x = x;
        cellBlock.y = y;
        let [currentLine, currentRemainingStream] = (0, strRead_1.readLine)(afterPointLine);
        currentLine = currentLine.trim();
        while (!(0, strRead_1.isNextChars)(currentLine, "#P") || currentLine.length === 0) { // exits when the next #P line is hit
            if (currentLine.length === 0) {
                if (currentRemainingStream.trim().length === 0) {
                    break;
                }
                const [nextLine, nextRemainingStream] = (0, strRead_1.readLine)(currentRemainingStream);
                if ((0, strRead_1.isNextChars)(nextLine, "#P")) {
                    break;
                }
                currentLine = nextLine;
                currentRemainingStream = nextRemainingStream;
                continue;
            }
            cellBlock.width = Math.max(cellBlock.width, currentLine.length);
            const row = new Array(cellBlock.width).fill(0);
            for (let i = 0; i < cellBlock.width; i++) {
                if (i < currentLine.length && currentLine[i] === LIFE_105_ALIVE_CHAR) {
                    row[i] = 1;
                    cellBlock.liveCoordinates.push([x + i, y - cellBlock.pattern.length]);
                }
            }
            cellBlock.pattern.push(row);
            if (currentRemainingStream.trim().length === 0) {
                break;
            }
            const [nextLine, nextRemainingStream] = (0, strRead_1.readLine)(currentRemainingStream);
            if ((0, strRead_1.isNextChars)(nextLine, "#P")) {
                break;
            }
            currentLine = nextLine;
            currentRemainingStream = nextRemainingStream;
        }
        console.log("Current Line Exited: ", currentLine);
        cellBlock.height = cellBlock.pattern.length;
        for (let i = 0; i < cellBlock.height; i++) { // Correct all pattern rows to be the same size
            if (cellBlock.pattern[i].length < cellBlock.width) {
                cellBlock.pattern[i].push(...new Array(cellBlock.width - cellBlock.pattern[i].length).fill(0));
            }
        }
        return [cellBlock, currentRemainingStream];
    }
    else {
        throw new Error(`Cannot read next Life 105 Cell Block, not positioned correctly. Must have "#P" next in the stream`);
    }
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
        const [cellBlock] = readLife105CellBlock(cellBlockStrings[i]);
        life105FileData.cellBlocks.push(cellBlock);
        life105FileData.liveCoordinates.push(...cellBlock.liveCoordinates);
    }
    // if (isNextChars(lines[currentLineIndex], "#P")) {
    //     const cellBlocksString = lines.slice(currentLineIndex).join("\n").trim()
    //     let remainingCellBlocksString = cellBlocksString
    //     while (remainingCellBlocksString.length > 0 && isNextChars(remainingCellBlocksString, "#P")) {
    //         const [cellBlock, remaining] = readLife105CellBlock(remainingCellBlocksString)
    //         life105FileData.cellBlocks.push(cellBlock)
    //         life105FileData.liveCoordinates.push(...cellBlock.liveCoordinates)
    //         remainingCellBlocksString = remaining
    //     }
    // } else {
    //     throw new Error(`[llcacodec::readLife105String given Life105String does not contain Cell Block data directly after hashed comments]`)
    // }
    life105FileData.liveCoordinates = (0, util_1.uniqueNumberPairArray)(life105FileData.liveCoordinates);
    return life105FileData;
}
exports.readLife105String = readLife105String;
// function writeLife105String()
