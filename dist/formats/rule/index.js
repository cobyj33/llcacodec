"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.convertLifeRule = exports.makeLifeRule = exports.readLifeRule = exports.getLifeRuleFormat = exports.isValidLifeRule = exports.isValidLifeRuleData = exports.CONWAY_LIFE_RULE_INTEGER = exports.CONWAY_RULE_STRING_SB = exports.CONWAY_RULE_STRING_BS = exports.CONWAY_LIFE_RULE_DATA = void 0;
const bs_1 = require("./bs");
Object.defineProperty(exports, "CONWAY_RULE_STRING_BS", { enumerable: true, get: function () { return bs_1.CONWAY_RULE_STRING_BS; } });
const sb_1 = require("./sb");
Object.defineProperty(exports, "CONWAY_RULE_STRING_SB", { enumerable: true, get: function () { return sb_1.CONWAY_RULE_STRING_SB; } });
const int_1 = require("./int");
Object.defineProperty(exports, "CONWAY_LIFE_RULE_INTEGER", { enumerable: true, get: function () { return int_1.CONWAY_LIFE_RULE_INTEGER; } });
const ruleData_1 = require("./ruleData");
Object.defineProperty(exports, "CONWAY_LIFE_RULE_DATA", { enumerable: true, get: function () { return ruleData_1.CONWAY_LIFE_RULE_DATA; } });
Object.defineProperty(exports, "isValidLifeRuleData", { enumerable: true, get: function () { return ruleData_1.isValidLifeRuleData; } });
const util_1 = require("../../core/util");
function isValidLifeRule(rule, format = "") {
    const foundFormat = format === "" ? getLifeRuleFormat(rule) : format;
    if (foundFormat === "N/A") {
        return false;
    }
    if (typeof (rule) === "number") {
        if (foundFormat !== "int") {
            return false;
        }
        return (0, int_1.isValidLifeRuleInteger)(rule);
    }
    if (typeof (rule) === "string") {
        switch (foundFormat) {
            case "b/s": return (0, bs_1.isValidBSLifeString)(rule);
            case "s/b": return (0, sb_1.isValidSBLifeString)(rule);
        }
    }
    return false;
}
exports.isValidLifeRule = isValidLifeRule;
function getLifeRuleFormat(rule) {
    if (typeof (rule) === "string") {
        if ((0, bs_1.isValidBSLifeString)(rule)) {
            return "b/s";
        }
        else if ((0, sb_1.isValidSBLifeString)(rule)) {
            return "s/b";
        }
    }
    else if (typeof (rule) === "number") {
        if ((0, int_1.isValidLifeRuleInteger)(rule)) {
            return "int";
        }
    }
    return "N/A";
}
exports.getLifeRuleFormat = getLifeRuleFormat;
function readLifeRule(rule, format = "") {
    const foundFormat = format === "" ? getLifeRuleFormat(rule) : format;
    if (foundFormat === "N/A") {
        throw new Error(`Could not parse Life String: ${rule}, could not find a fitting format (Available formats are "b/s", "s/b", and "int"), read at https://conwaylife.com/wiki/Rulestring https://conwaylife.com/wiki/Rule_integer)`);
    }
    if (typeof (rule) === "number") {
        if (format !== "int" && format !== "") { // requested a string-based format with an integer value
            throw new Error(`Could not read rule ${rule} in requested format ${format}, as the integer value ${rule} cannot be in the ${format} string format`);
        }
        return (0, int_1.readLifeRuleInteger)(rule);
    }
    switch (foundFormat) {
        case "b/s": return (0, bs_1.readBSRuleString)(rule);
        case "s/b": return (0, sb_1.readSBRuleString)(rule);
    }
    throw new Error(`Could not parse Life String: ${rule}, could not find a fitting format (Available formats are "b/s", "s/b", and "int"), read at https://conwaylife.com/wiki/Rulestring https://conwaylife.com/wiki/Rule_integer)`);
}
exports.readLifeRule = readLifeRule;
function makeLifeRule(lifeRuleData, format) {
    try {
        switch (format) {
            case "b/s": return (0, bs_1.makeBSLifeString)(lifeRuleData);
            case "s/b": return (0, sb_1.makeSBLifeString)(lifeRuleData);
            case "int": return (0, int_1.makeLifeRuleInteger)(lifeRuleData);
        }
    }
    catch (e) {
        throw new Error(`Could not make life rule string from life rule data object: (${JSON.stringify(lifeRuleData)}) : ${(0, util_1.getErrorMessage)(e)}`);
    }
}
exports.makeLifeRule = makeLifeRule;
function convertLifeRule(original, dstFormat) {
    const lifeRuleData = readLifeRule(original);
    return makeLifeRule(lifeRuleData, dstFormat);
}
exports.convertLifeRule = convertLifeRule;
