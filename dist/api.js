"use strict";
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
        throw new Error("Cannot parse undefined life file");
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
function isLifeStringFormat(data, format) {
    switch (format) {
        case "life 1.06": return (0, life106_1.isLife106String)(data);
        case "life 1.05": return (0, life105_1.isLife105String)(data);
        case "plaintext": return (0, plaintext_1.isPlaintextString)(data);
        case "rle": return (0, rle_1.isRLEString)(data);
    }
}
exports.isLifeStringFormat = isLifeStringFormat;
function getLifeStringFormat(data) {
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
function writeLifeString(data) {
    switch (data.format) {
        case "life 1.06": return (0, life106_1.writeLife106String)(data);
        case "plaintext": return (0, plaintext_1.writePlaintextString)(data);
        case "rle": return (0, rle_1.writeRLEString)(data);
    }
}
exports.writeLifeString = writeLifeString;
