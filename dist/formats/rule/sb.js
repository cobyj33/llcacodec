"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.readSBRuleString = exports.makeSBLifeString = exports.isValidSBLifeString = exports.getSBLifeStringError = exports.CONWAY_RULE_STRING_SB = void 0;
const ruleData_1 = require("./ruleData");
exports.CONWAY_RULE_STRING_SB = "23/3";
function getSBLifeStringError(lifeString) {
    const sides = lifeString.split("/");
    if (sides.length !== 2) {
        return `Not able to split s/b life-like rule string into birth and survival counts, format must include a forward slash <Survival Digits>/<Birth Digits> (got: ${lifeString})`;
    }
    const survivalNums = [];
    const birthNums = [];
    if (sides[0].length > 0) {
        if (sides[0][0].toUpperCase() === "S") {
            survivalNums.push(...sides[0].substring(1).split('').map(numChar => Number.parseInt(numChar)));
        }
        else {
            survivalNums.push(...sides[0].split('').map(numChar => Number.parseInt(numChar)));
        }
    }
    if (sides[1].length > 0) {
        if (sides[1][0].toUpperCase() === "B") {
            birthNums.push(...sides[1].substring(1).split('').map(numChar => Number.parseInt(numChar)));
        }
        else {
            birthNums.push(...sides[1].split('').map(numChar => Number.parseInt(numChar)));
        }
    }
    if (survivalNums.some(num => isNaN(num)) || birthNums.some(num => isNaN(num))) {
        return `Must include only numbers before and after the slash "/" in S/B notation (<Survival Digits>/<Birth Digits>) (got: ${lifeString})`;
    }
    else if (survivalNums.some(num => num === 9) || birthNums.some(num => num === 9)) {
        return `9 is an invalid input for s/b notation string (got: ${lifeString})`;
    }
    else if (new Set(survivalNums).size !== survivalNums.length || new Set(birthNums).size !== birthNums.length) {
        return `Replicate number on side of <Survival Digits>/<Birth Digits> (got ${lifeString})`;
    }
    return "";
}
exports.getSBLifeStringError = getSBLifeStringError;
function isValidSBLifeString(lifeString) {
    return getSBLifeStringError(lifeString) === "";
}
exports.isValidSBLifeString = isValidSBLifeString;
function makeSBLifeString(lifeRuleData) {
    const { birth, survival } = lifeRuleData;
    if ((0, ruleData_1.isValidLifeRuleData)(lifeRuleData)) {
        return `${[...survival].sort((a, b) => a - b).map(num => num.toString()).join("")}/${[...birth].sort((a, b) => a - b).map(num => num.toString()).join("")}`;
    }
    throw new Error(`[makeSBLifeString] Error while creating lifeString from (${JSON.stringify(lifeRuleData)}), ${(0, ruleData_1.getLifeRuleDataError)(lifeRuleData)}`);
}
exports.makeSBLifeString = makeSBLifeString;
function readSBRuleString(lifeString) {
    if (isValidSBLifeString(lifeString)) {
        const sides = lifeString.split("/");
        return {
            survival: sides[0].substring(sides[0].length > 0 && sides[0][0].toUpperCase() === "S" ? 1 : 0).split("").map(digit => Number.parseInt(digit)),
            birth: sides[1].substring(sides[1].length > 0 && sides[1][0].toUpperCase() === "B" ? 1 : 0).split("").map(digit => Number.parseInt(digit))
        };
    }
    throw new Error(`[readSBRuleString] Error while parsing s/b notation ruleString: ${getSBLifeStringError(lifeString)}`);
}
exports.readSBRuleString = readSBRuleString;
