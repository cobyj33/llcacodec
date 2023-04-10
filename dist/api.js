"use strict";
/**
 * @file api.ts
 * @description The public API for the llcacodec library
 * @author Jacoby Johnson
 * @version 0.1.4
 * @date April 9th, 2023
 * @license MIT
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.writeLifeString = exports.getLifeStringFormat = exports.isLifeStringFormat = exports.readLifeString = exports.getLifeRuleFormat = exports.isValidLifeRule = exports.makeLifeRule = exports.readLifeRule = exports.CONWAY_LIFE_RULE_DATA = void 0;
const life106_1 = require("./formats/file/life106");
const plaintext_1 = require("./formats/file/plaintext");
const rle_1 = require("./formats/file/rle");
const life105_1 = require("./formats/file/life105");
var ruleData_1 = require("./formats/rule/ruleData");
Object.defineProperty(exports, "CONWAY_LIFE_RULE_DATA", { enumerable: true, get: function () { return ruleData_1.CONWAY_LIFE_RULE_DATA; } });
var rule_1 = require("./formats/rule");
Object.defineProperty(exports, "readLifeRule", { enumerable: true, get: function () { return rule_1.readLifeRule; } });
Object.defineProperty(exports, "makeLifeRule", { enumerable: true, get: function () { return rule_1.makeLifeRule; } });
Object.defineProperty(exports, "isValidLifeRule", { enumerable: true, get: function () { return rule_1.isValidLifeRule; } });
Object.defineProperty(exports, "getLifeRuleFormat", { enumerable: true, get: function () { return rule_1.getLifeRuleFormat; } });
function readLifeString(data, format = "") {
    if (format === undefined) {
        throw new Error("[llcacodec]: Cannot parse undefined life file");
    }
    const foundFormat = format === "" ? getLifeStringFormat(data) : format;
    switch (foundFormat) {
        case "plaintext": return (0, plaintext_1.readPlaintextString)(data);
        case "life 1.06": return (0, life106_1.readLife106String)(data);
        case "rle": return (0, rle_1.readRLEString)(data);
        case "life 1.05": return (0, life105_1.readLife105String)(data);
        case "": throw new Error(`[llcacodecjs] Could not read life file: matching life file format could not be found`);
    }
}
exports.readLifeString = readLifeString;
/**
 * Assert whether a life string conforms to a given format
 *
 * Note that just because isLifeStringFormat returns true does NOT mean that readLifeString will not throw an error when called with the given life string.
 * isLifeStringFormat does not confirm if the passed data is valid. It only tries to detect if the given life string
 * conforms to a format by searching for required headers and sequences in the string.
 *
 * @param data The life string to test
 * @param format The format to test conformity against the given life string with.
 * Can either be "plaintext", "life 1.05", "life 1.06", or "plaintext"
 * @returns Whether the given life string conforms with the given format
 */
function isLifeStringFormat(data, format) {
    switch (format) {
        case "life 1.06": return (0, life106_1.isLife106String)(data);
        case "life 1.05": return (0, life105_1.isLife105String)(data);
        case "plaintext": return (0, plaintext_1.isPlaintextString)(data);
        case "rle": return (0, rle_1.isRLEString)(data);
    }
}
exports.isLifeStringFormat = isLifeStringFormat;
/** Detect the format of a life string
 *
 * Note that just because getLifeStringFormat detects a file format does NOT mean that readLifeString will not throw an error
 * when called with the given life string. getLifeStringFormat does not confirm if the passed data is valid.
 * It only tries to detect the given life string's format by searching for required headers and sequences in the string.
 *
 * @param data The life string to get the format of
 * @returns Either "life 1.06", "life 1.05", "rle", or "plaintext" on the finding
 * of a successful format, and an empty string when no format could be found.
 */
function getLifeStringFormat(data) {
    // Note how the tests are ordered. They are ordered from the most simple to identify
    // to the least simple to identify. Life 1.06 and Life 1.05 can simply be identified by
    // if their file begins with the appropriate header data. isRLEString is identified by the existence of 
    // a header, although it may not be at the beginning of the file. Finally, Plaintext is identified by simply
    // checking if the file parses correctly
    if ((0, life106_1.isLife106String)(data)) {
        return "life 1.06";
    }
    else if ((0, life105_1.isLife105String)(data)) {
        return "life 1.05";
    }
    else if ((0, rle_1.isRLEString)(data)) {
        return "rle";
    }
    else if ((0, plaintext_1.isPlaintextString)(data)) {
        return "plaintext";
    }
    return "";
}
exports.getLifeStringFormat = getLifeStringFormat;
/**
 * Write a Life String, keeping the passed data in a portable string format
 *
 * writeLifeString can write in either one of these formats:
 *
 * [Life 1.06](https://conwaylife.com/wiki/Life_1.06):
 * represented by the presence of { format: "life 1.06" } in the given structured data
 *
 * [Plaintext](https://conwaylife.com/wiki/Plaintext):
 * represented by the presence of { format: "plaintext" } in the given structured data
 *
 * [Run-Length Encoded (RLE)](https://conwaylife.com/wiki/Run_Length_Encoded):
 * represented by the presence of { format: "rle" } in the given structured data
 *
 * Given all of these formats, rle will likely be the most compressed and desired
 * format the large majority of the time. Generally, it is much better to represent
 * any semi-large or large pattern, but it is less straight-forward for humans to read
 * if that is desired.
 *
 * Plaintext will be a little larger, but should generally not be used for patterns with a bounding box with a width
 * greater than 80 cells. Plaintext, however, could be desired for smaller patterns because of
 * the human-readability of the pattern's diagram.
 *
 * Life 1.06 is also viable for smaller patterns. However, since Life 1.06 lists every single
 * coordinate without any compression, Life 1.06 could make for larger files as well.
 *
 * The particulars of each data format is out of the scope of this little docstring,
 * and can be found in DOCUMENTATION.md in the llcacodec repository. This documentation
 * could also be found online [here](https://www.github.com/cobyj33/llcacodec/blob/master/DOCUMENTATION.md)
 *
 * @param data The structured data to use when creating the life string
 * @returns A life string containing the passed in compiled data.
 */
function writeLifeString(data) {
    switch (data.format) {
        case "life 1.06": return (0, life106_1.writeLife106String)(data);
        case "plaintext": return (0, plaintext_1.writePlaintextString)(data);
        case "rle": return (0, rle_1.writeRLEString)(data);
    }
}
exports.writeLifeString = writeLifeString;
