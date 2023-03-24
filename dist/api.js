"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.writeLifeFile = exports.getLifeFileFormat = exports.readLifeFile = exports.readLifeFileLiveCoordinates = exports.getLifeRuleFormat = exports.isValidLifeRule = exports.makeLifeRule = exports.readLifeRule = exports.CONWAY_LIFE_RULE_DATA = void 0;
const life106_1 = require("./formats/file/life106");
const plaintext_1 = require("./formats/file/plaintext");
const rle_1 = require("./formats/file/rle");
const life105_1 = require("./formats/file/life105");
const util_1 = require("./core/util");
var ruleData_1 = require("./formats/rule/ruleData");
Object.defineProperty(exports, "CONWAY_LIFE_RULE_DATA", { enumerable: true, get: function () { return ruleData_1.CONWAY_LIFE_RULE_DATA; } });
var rule_1 = require("./formats/rule");
Object.defineProperty(exports, "readLifeRule", { enumerable: true, get: function () { return rule_1.readLifeRule; } });
Object.defineProperty(exports, "makeLifeRule", { enumerable: true, get: function () { return rule_1.makeLifeRule; } });
Object.defineProperty(exports, "isValidLifeRule", { enumerable: true, get: function () { return rule_1.isValidLifeRule; } });
Object.defineProperty(exports, "getLifeRuleFormat", { enumerable: true, get: function () { return rule_1.getLifeRuleFormat; } });
function readLifeFileLiveCoordinates(data, format) {
    switch (format) {
        case "plaintext": return (0, plaintext_1.readPlainTextString)(data).liveCoordinates;
        case "life 1.06": return (0, life106_1.readLife106String)(data);
        case "life 1.05": return (0, life105_1.readLife105String)(data).liveCoordinates;
        case "rle": return (0, rle_1.readRLEString)(data).liveCoordinates;
        case "": {
            const format = getLifeFileFormat(data);
            if (format !== "N/A") {
                return readLifeFileLiveCoordinates(data, format);
            }
            throw new Error("");
        }
    }
    throw new Error("");
}
exports.readLifeFileLiveCoordinates = readLifeFileLiveCoordinates;
function readLifeFile(data, format = "") {
    if (format === null || format === undefined) {
        throw new Error("Cannot parse null or undefined life file");
    }
    const foundFormat = format === "" ? getLifeFileFormat(data) : format;
    switch (foundFormat) {
        case "plaintext": return (0, plaintext_1.readPlainTextString)(data);
        case "life 1.06": return (0, life106_1.readLife106String)(data);
        case "rle": return (0, rle_1.readRLEString)(data);
        case "life 1.05": return (0, life105_1.readLife105String)(data);
        case "N/A": throw new Error(`[llcacodecjs] Could not read life file: matching life file format could not be found`);
        default: throw new Error(`[llcacodecjs] Could not read life file: Invalid format of ${format} was inputted `);
    }
}
exports.readLifeFile = readLifeFile;
function getLifeFileFormat(data) {
    if ((0, life106_1.isLife106String)(data)) {
        return "life 1.06";
    }
    else if ((0, life105_1.isLife105String)(data)) {
        return "life 1.05";
    }
    else if ((0, rle_1.isRLEString)(data)) {
        return "rle";
    }
    else if ((0, plaintext_1.isPlainTextString)(data)) {
        return "plaintext";
    }
    return "N/A";
}
exports.getLifeFileFormat = getLifeFileFormat;
function isPlainTextMatrixWriteData(data) {
    return typeof (data) === "object" && data !== null &&
        "name" in data && "description" in data && "matrix" in data &&
        typeof (data.name) === "string" && (typeof (data.description) === "string" || (0, util_1.isStringArray)(data.description)) &&
        (0, util_1.isCellMatrix)(data.matrix);
}
function isPlainTextCoordinateWriteData(data) {
    return typeof (data) === "object" && data !== null &&
        "name" in data && "description" in data && "liveCoordinates" in data &&
        typeof (data.name) === "string" && (typeof (data.description) === "string" || (0, util_1.isStringArray)(data.description)) &&
        (0, util_1.isCellCoordinateArray)(data.liveCoordinates);
}
function writeLifeFile(format, data) {
    switch (format) {
        case "life 1.06": {
            if ((0, util_1.isCellCoordinateArray)(data)) {
                return (0, life106_1.writeLife106String)(data);
            }
            throw new Error(`[llcacodecjs] `);
        }
        case "plaintext": {
            if (isPlainTextMatrixWriteData(data)) {
                return (0, plaintext_1.writePlainTextMatrix)(data.matrix, data.name, data.description);
            }
            else if (isPlainTextCoordinateWriteData(data)) {
                return (0, plaintext_1.writePlainTextFromCoordinates)(data.liveCoordinates, data.name, data.description);
            }
            throw new Error(`[llcacodecjs] `);
        }
    }
}
exports.writeLifeFile = writeLifeFile;
