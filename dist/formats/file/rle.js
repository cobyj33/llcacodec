"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.readRLEString = exports.isRLEString = exports.readRLEStringHeader = exports.readRLEData = void 0;
const strRead_1 = require("../../core/strRead");
const util_1 = require("../../core/util");
const rule_1 = require("../rule");
const RLE_DEAD_CELL_CHAR = "b";
const RLE_LIVE_CELL_CHAR = "o";
const RLE_NEW_LINE_CHAR = "$";
const RLE_TERMINATION_CHAR = "!";
const DIGIT_DECIMAL_CHARACTERS = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];
const RLE_VALID_CHARACTERS = [RLE_DEAD_CELL_CHAR, RLE_LIVE_CELL_CHAR, RLE_NEW_LINE_CHAR, RLE_TERMINATION_CHAR, ...DIGIT_DECIMAL_CHARACTERS, "\n", "\r"];
// --------------------------------------------------------------
// --------------------------------------------------------------
// --------------------------------------------------------------
// ------------------------- READING ----------------------------
// --------------------------------------------------------------
// --------------------------------------------------------------
// --------------------------------------------------------------
function isValidRLEDataCharacter(char) {
    return RLE_VALID_CHARACTERS.some(validChar => validChar === char);
}
/**
 * Must start
 *
 * Must end with ! or have no more data at the end at the end (please end your RLE data with a !)
 *
 * @param rleData
 */
function readRLEData(rlePattern, topleft = [0, 0]) {
    let i = 0;
    let currRun = [];
    const rleData = {
        liveCoordinates: [],
        pattern: "",
        endingIndex: 0,
        topleft: [...topleft]
    };
    let currCoordinate = [...topleft];
    while (isValidRLEDataCharacter(rlePattern[i]) && i < rlePattern.length) {
        if (rlePattern[i] === RLE_TERMINATION_CHAR) {
            rleData.pattern = rlePattern.substring(0, i);
            rleData.endingIndex = i;
            return rleData;
        }
        else if ((0, util_1.isDigit)(rlePattern[i])) {
            currRun.push(rlePattern[i]);
        }
        else if (rlePattern[i] === RLE_LIVE_CELL_CHAR || rlePattern[i] === RLE_DEAD_CELL_CHAR) {
            const runLength = currRun.length === 0 ? 1 : Number.parseInt(currRun.join(""));
            currRun = [];
            if (isNaN(runLength)) {
                throw new Error("");
            }
            if (rlePattern[i] === RLE_LIVE_CELL_CHAR) {
                for (let j = 0; j < runLength; j++) {
                    rleData.liveCoordinates.push([...currCoordinate]);
                    currCoordinate[0]++;
                }
            }
            else if (rlePattern[i] === RLE_DEAD_CELL_CHAR) {
                currCoordinate[0] += runLength;
            }
        }
        else if (rlePattern[i] === RLE_NEW_LINE_CHAR) {
            currCoordinate[0] = topleft[0];
            currCoordinate[1]--;
        }
        i++;
    }
    if (i === rlePattern.length - 1) {
        rleData.pattern = rlePattern;
        rleData.endingIndex = rlePattern.length - 1;
        return rleData;
    }
    throw new Error(`Unexpected ending to RLE Data. Ended at char (${rlePattern[i]} at index ${i} of ${rlePattern.length})`);
}
exports.readRLEData = readRLEData;
function readRLEStringHeader(headerLine) {
    const trimmed = headerLine.trim();
    const ruleFileHeaderData = {
        width: 0,
        height: 0,
        ruleString: null,
        rule: null,
        full: trimmed
    };
    const [, afterXEquals] = (0, strRead_1.readChars)(trimmed, "x=");
    const [width, afterWidth] = (0, strRead_1.readCrampedNumber)(afterXEquals);
    ruleFileHeaderData.width = width;
    const [, afterYEquals] = (0, strRead_1.readChars)(afterWidth, ",y=");
    const [height, afterHeight] = (0, strRead_1.readCrampedNumber)(afterYEquals);
    ruleFileHeaderData.height = height;
    if ((0, strRead_1.isNextChars)(afterHeight, ",rule=")) {
        const [, afterRule] = (0, strRead_1.readChars)(afterHeight, ",rule=");
        const [rule, end] = (0, strRead_1.readNext)(afterRule);
        if ((0, rule_1.isValidLifeRule)(rule)) {
            ruleFileHeaderData.rule = (0, rule_1.readLifeRule)(rule);
            ruleFileHeaderData.ruleString = rule;
        }
        else {
            throw new Error(`Invalid Rule found in RLE Data while parsing RLE Header Line: "${rule}" ( passed in "${headerLine}") `);
        }
    }
    return ruleFileHeaderData;
}
exports.readRLEStringHeader = readRLEStringHeader;
function isRLEString(file) {
    const lines = file.trim().split("\n");
    for (let i = 0; i < lines.length; i++) {
        if (!lines[i].trim().startsWith("#") && i < lines.length - 1) {
            return !(0, util_1.throws)(() => readRLEStringHeader(lines[i + 1].trim()));
        }
    }
    return false;
}
exports.isRLEString = isRLEString;
function readRLEString(file) {
    const lines = file.trim().split("\n");
    let currentLine = 0;
    const rleFileData = {
        comments: [],
        name: "",
        creationData: "",
        topleft: null,
        width: 0,
        height: 0,
        ruleString: rule_1.CONWAY_RULE_STRING_BS,
        rule: (0, rule_1.CONWAY_LIFE_RULE_DATA)(),
        liveCoordinates: [],
        hashLines: []
    };
    //commented lines
    while ((0, strRead_1.isNextChar)(lines[currentLine], "#")) {
        const [, afterHashTag] = (0, strRead_1.readChar)(lines[currentLine], "#");
        const [id, afterID] = (0, strRead_1.readChar)(afterHashTag);
        const content = afterID.trim();
        if (content.length > 0) {
            if (id === "C" || id === "c") {
                rleFileData.comments.push(content);
            }
            else if (id === "N") {
                rleFileData.name = content;
            }
            else if (id === "O") {
                rleFileData.creationData = content;
            }
            else if (id === "P" || id === "R") {
                const [[x, y]] = (0, strRead_1.readNumbers)(afterID, 2);
                rleFileData.topleft = [x, y];
            }
            else if (id === "r") {
                rleFileData.ruleString = content;
                rleFileData.rule = (0, rule_1.readLifeRule)(content);
            }
        }
        rleFileData.hashLines.push({
            content: afterID.trim(),
            id: id,
            full: lines[currentLine].trim()
        });
        currentLine++;
    }
    //header line
    const headerLineData = readRLEStringHeader(lines[currentLine]);
    rleFileData.width = headerLineData.width;
    rleFileData.height = headerLineData.height;
    if (headerLineData.ruleString !== null && headerLineData.rule !== null) {
        rleFileData.rule = headerLineData.rule;
        rleFileData.ruleString = headerLineData.ruleString;
    }
    //rle encoded data
    currentLine++;
    const afterHeader = lines.slice(currentLine).join("\n");
    const data = readRLEData(afterHeader, rleFileData.topleft !== null ? rleFileData.topleft : [0, 0]);
    rleFileData.liveCoordinates = data.liveCoordinates;
    if (data.endingIndex + 1 !== afterHeader.length - 1) {
        const afterRLEData = afterHeader.substring(data.endingIndex + 1);
        const linesAfterRLEData = afterRLEData.split("\n");
        rleFileData.comments.push(...linesAfterRLEData.map(line => line.trim()).filter(line => line.length > 0));
    }
    //Everything after this is considered a comment
    return rleFileData;
}
exports.readRLEString = readRLEString;
// --------------------------------------------------------------
// --------------------------------------------------------------
// --------------------------------------------------------------
// ------------------------- WRITING ----------------------------
// --------------------------------------------------------------
// --------------------------------------------------------------
// --------------------------------------------------------------
