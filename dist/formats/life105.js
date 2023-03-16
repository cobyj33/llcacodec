"use strict";
// Life 1.05 File Format Spec: https://conwaylife.com/wiki/Life_1.05
Object.defineProperty(exports, "__esModule", { value: true });
exports.hello = exports.readLife105String = exports.isLife105String = void 0;
const stringStream_1 = require("../core/stringStream");
const rule_1 = require("./rule");
const LIFE_105_HEADER = "#Life 1.05";
const MAX_DESCRIPTION_LINE_COUNT = 22;
const LIFE_105_MAX_LINE_LENGTH = 80;
const Life105FileExtensions = [".lif", ".life"];
const LIFE_105_DEAD_CHAR = ".";
const LIFE_105_ALIVE_CHAR = "*";
function readLife105CellBlock(data) {
    if ((0, stringStream_1.isNextChars)(data, "#P")) {
        const cellBlock = {
            x: 0,
            y: 0,
            width: 0,
            height: 0,
            pattern: [],
            cellCoordinates: []
        };
        const [pointLine, afterPointLine] = (0, stringStream_1.readLine)(data);
        const [, afterPointDeclaration] = (0, stringStream_1.readChars)(pointLine, "#P");
        const [[x, y]] = (0, stringStream_1.readIntegers)(afterPointDeclaration, 2);
        cellBlock.x = x;
        cellBlock.y = y;
        let [currentLine, currentRemainingStream] = (0, stringStream_1.readLine)(afterPointLine);
        while (!(0, stringStream_1.isNextChars)(currentLine, "#P")) { // exits when the next #P line is hit
            cellBlock.width = Math.max(cellBlock.width, currentLine.length);
            const row = new Array(cellBlock.width).fill(0);
            for (let i = 0; i < cellBlock.width; i++) {
                if (currentLine[i] === LIFE_105_ALIVE_CHAR) {
                    row[i] = 1;
                    cellBlock.cellCoordinates.push([x + i, y - cellBlock.height]);
                }
            }
            cellBlock.pattern.push(row);
            const [nextLine, nextRemainingStream] = (0, stringStream_1.readLine)(currentRemainingStream);
            if ((0, stringStream_1.isNextChars)(nextLine, "#P")) {
                break;
            }
            currentLine = nextLine;
            currentRemainingStream = nextRemainingStream;
            cellBlock.height++; // increments after setting the coordinates, 
        }
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
function isLife105String(file) {
    return file.trim().startsWith(LIFE_105_HEADER);
}
exports.isLife105String = isLife105String;
function readLife105String(file) {
    file = file.replace("\r", "");
    const life105FileData = {
        cellBlocks: [],
        cellCoordinates: [],
        descriptions: [],
        ruleString: rule_1.CONWAY_RULE_STRING_SB,
        rule: (0, rule_1.CONWAY_LIFE_RULE_DATA)(),
        hashLines: []
    };
    const lines = file.split("\n");
    const headerLine = lines[0];
    if (!headerLine.trim().startsWith(LIFE_105_HEADER)) {
        throw new Error("");
    }
    let currentLine = 1;
    while ((0, stringStream_1.isNextChar)(lines[currentLine], "#")) {
        const [, afterHash] = (0, stringStream_1.readChar)(lines[currentLine], "#");
        const [id, afterID] = (0, stringStream_1.readChar)(afterHash);
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
        else if (id === "P") {
            break;
        }
        life105FileData.hashLines.push({
            id: id,
            content: trimmedContent,
            full: lines[currentLine].trim()
        });
        currentLine++;
    }
    if ((0, stringStream_1.isNextChars)(lines[currentLine], "#P")) {
        const cellBlocksString = lines.slice(currentLine).join("\n").trim();
        let remainingCellBlocksString = cellBlocksString;
        while (remainingCellBlocksString.length > 0) {
            try {
                const cellBlockReadingData = readLife105CellBlock(remainingCellBlocksString);
                console.log("Read cell block: ", cellBlockReadingData[0]);
                console.log("Remaining: ", cellBlockReadingData[1]);
                life105FileData.cellBlocks.push(cellBlockReadingData[0]);
                life105FileData.cellCoordinates.push(...cellBlockReadingData[0].cellCoordinates);
                remainingCellBlocksString = cellBlockReadingData[1];
            }
            catch (err) {
                break;
            }
        }
    }
    return life105FileData;
}
exports.readLife105String = readLife105String;
function hello() {
    return 5;
}
exports.hello = hello;
