"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.writeRLEString = exports.readRLEString = exports.isRLEString = exports.readRLEStringHeader = exports.readRLEData = void 0;
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
            const runLength = currRun.length === 0 ? 1 : Number.parseInt(currRun.join(""));
            currRun = [];
            currCoordinate[0] = topleft[0];
            currCoordinate[1] -= runLength;
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
    const rleFileHeaderData = {
        width: 0,
        height: 0,
        ruleString: null,
        rule: null,
        full: trimmed
    };
    const [, afterXEquals] = (0, strRead_1.readChars)(trimmed, "x=");
    const [width, afterWidth] = (0, strRead_1.readCrampedNumber)(afterXEquals);
    rleFileHeaderData.width = width;
    const [, afterYEquals] = (0, strRead_1.readChars)(afterWidth, ",y=");
    const [height, afterHeight] = (0, strRead_1.readCrampedNumber)(afterYEquals);
    rleFileHeaderData.height = height;
    if ((0, strRead_1.isNextChars)(afterHeight, ",rule=")) {
        const [, afterRule] = (0, strRead_1.readChars)(afterHeight, ",rule=");
        const [rule, end] = (0, strRead_1.readNext)(afterRule);
        if ((0, rule_1.isValidLifeRule)(rule)) {
            rleFileHeaderData.rule = (0, rule_1.readLifeRule)(rule);
            rleFileHeaderData.ruleString = rule;
        }
        else {
            throw new Error(`Invalid Rule found in RLE Data while parsing RLE Header Line: "${rule}" ( passed in "${headerLine}") `);
        }
    }
    return rleFileHeaderData;
}
exports.readRLEStringHeader = readRLEStringHeader;
function isRLEString(file) {
    const lines = file.trim().split("\n");
    for (let i = 0; i < lines.length; i++) {
        if (!lines[i].trim().startsWith("#") && i < lines.length - 1) {
            return !(0, util_1.throws)(() => readRLEStringHeader(lines[i].trim()));
        }
    }
    return false;
}
exports.isRLEString = isRLEString;
function readRLEString(file) {
    const lines = file.trim().split("\n");
    let currentLine = 0;
    const rleDecodedData = {
        format: "rle",
        comments: [],
        name: "",
        creationData: "",
        topleft: [0, 0],
        foundTopLeft: false,
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
                rleDecodedData.comments.push(content);
            }
            else if (id === "N") {
                rleDecodedData.name = content;
            }
            else if (id === "O") {
                rleDecodedData.creationData = content;
            }
            else if (id === "P" || id === "R") {
                const [[x, y]] = (0, strRead_1.readNumbers)(afterID, 2);
                rleDecodedData.topleft = [x, y];
                rleDecodedData.foundTopLeft = true;
            }
            else if (id === "r") {
                rleDecodedData.ruleString = content;
                rleDecodedData.rule = (0, rule_1.readLifeRule)(content);
            }
        }
        rleDecodedData.hashLines.push({
            content: afterID.trim(),
            id: id,
            full: lines[currentLine].trim()
        });
        currentLine++;
    }
    //header line
    const headerLineData = readRLEStringHeader(lines[currentLine]);
    rleDecodedData.width = headerLineData.width;
    rleDecodedData.height = headerLineData.height;
    if (headerLineData.ruleString !== null && headerLineData.rule !== null) {
        rleDecodedData.rule = headerLineData.rule;
        rleDecodedData.ruleString = headerLineData.ruleString;
    }
    //rle encoded data
    currentLine++;
    const afterHeader = lines.slice(currentLine).join("\n");
    const data = readRLEData(afterHeader, rleDecodedData.topleft);
    rleDecodedData.liveCoordinates = data.liveCoordinates;
    if (data.endingIndex + 1 !== afterHeader.length - 1) {
        const afterRLEData = afterHeader.substring(data.endingIndex + 1);
        const linesAfterRLEData = afterRLEData.split("\n");
        rleDecodedData.comments.push(...linesAfterRLEData.map(line => line.trim()).filter(line => line.length > 0));
    }
    //Everything after this is considered a comment
    return rleDecodedData;
}
exports.readRLEString = readRLEString;
// --------------------------------------------------------------
// --------------------------------------------------------------
// --------------------------------------------------------------
// ------------------------- WRITING ----------------------------
// --------------------------------------------------------------
// --------------------------------------------------------------
// --------------------------------------------------------------
function rleEncode(char, count) {
    if (char.length !== 1) {
        throw new Error(`[llcacodec] Cannot RLE Encode character ${char} with a length of ${char.length}. Length of character must be 1`);
    }
    if (count < 0 || !Number.isInteger(count)) {
        throw new Error(`[llcacodec] Cannot RLE Encode character ${char} with a count of ${count}. The count must be an integer greater than or equal to 1`);
    }
    if (count === 0) {
        return "";
    }
    else if (count === 1) {
        return char;
    }
    else {
        return `${count}${char}`;
    }
}
function writeRLEDataM(matrix) {
    const encoding = [];
    for (let row = 0; row < matrix.length; row++) {
        let anyInLine = false;
        let currentLine = [];
        for (let col = 0; col < matrix[row].length; col++) {
            if (matrix[row][col] === 1) {
                anyInLine = true;
                currentLine.push(RLE_LIVE_CELL_CHAR);
            }
            else if (matrix[row][col] === 0) {
                currentLine.push(RLE_DEAD_CELL_CHAR);
            }
            else {
                throw new Error(`[llcacodec] Cannot write RLE data where matrix has values that are not 0 or 1 ( got ${matrix[row][col]} at row ${row} and col ${col}) `);
            }
        }
        if (anyInLine) {
            encoding.push(...currentLine);
        }
        encoding.push(RLE_NEW_LINE_CHAR);
    }
    encoding.push(RLE_TERMINATION_CHAR);
    const rleEncodedBuffer = [];
    let currentChar = encoding[0];
    let currentCharCount = 1;
    for (let i = 1; i < encoding.length; i++) {
        if (encoding[i] === currentChar) {
            currentCharCount++;
        }
        else {
            rleEncodedBuffer.push(rleEncode(currentChar, currentCharCount));
            currentChar = encoding[i];
            currentCharCount = 1;
        }
    }
    rleEncodedBuffer.push(RLE_TERMINATION_CHAR);
    return rleEncodedBuffer.join("");
}
function writeRLEDataC(liveCoordinates) {
    if (liveCoordinates.length === 0) {
        return "";
    }
    return writeRLEDataM((0, util_1.numberPairArrayToMatrix)(liveCoordinates));
}
const MAX_RLE_CHARACTER_LINE_WIDTH = 70;
function writeRLEString(data) {
    const comments = data.comments !== undefined ? [...data.comments] : [];
    const creationData = data.creationData !== undefined ? data.creationData : "";
    const name = data.name !== undefined ? data.name : "";
    let bsRule = rule_1.CONWAY_RULE_STRING_BS;
    if (data.rule !== undefined) {
        if (typeof (data.rule) === "string" || typeof (data.rule) === "number") {
            bsRule = (0, rule_1.convertLifeRule)(data.rule, "b/s");
        }
        else {
            bsRule = (0, rule_1.makeLifeRule)(data.rule, "b/s");
        }
    }
    let topleft = [0, 0];
    let width = 0;
    let height = 0;
    if ("matrix" in data) {
        width = Math.max(...data.matrix.map(row => row.length));
        height = data.matrix.length;
        topleft = data.topleft;
    }
    else if ("liveCoordinates" in data) {
        const bounds = (0, util_1.getCellBoundingBox)(data.liveCoordinates);
        width = bounds.width;
        height = bounds.height;
        topleft = [bounds.x, bounds.y];
    }
    const lineBuilder = [];
    if (name !== "") {
        lineBuilder.push(`#N ${name}`);
    }
    if (creationData !== "") {
        lineBuilder.push(`#O ${creationData}`);
    }
    const trimmedComments = [];
    for (let i = 0; i < comments.length; i++) {
        for (let j = 0; j < comments[i].length; j += MAX_RLE_CHARACTER_LINE_WIDTH) {
            trimmedComments.push(comments[i].substring(j, Math.min(comments[i].length, j + MAX_RLE_CHARACTER_LINE_WIDTH)));
        }
    }
    trimmedComments.forEach(trimmedComments => lineBuilder.push(`#C ${trimmedComments}`));
    lineBuilder.push(`x = ${width}, y = ${height}, rule = ${bsRule}`);
    lineBuilder.push("matrix" in data ? writeRLEDataM(data.matrix) : writeRLEDataC(data.liveCoordinates));
    return lineBuilder.join("\n");
}
exports.writeRLEString = writeRLEString;
