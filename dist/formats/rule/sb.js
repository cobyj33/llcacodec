"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.readSBRuleString = exports.makeSBLifeString = exports.isValidSBLifeString = exports.getSBLifeStringError = exports.CONWAY_RULE_STRING_SB = void 0;
const ruleData_1 = require("./ruleData");
exports.CONWAY_RULE_STRING_SB = "23/3";
function getSBLifeStringError(lifeString) {
    const sides = lifeString.split("/");
    if (sides.length !== 2) {
        return "Not able to split s/b life-like rule string into birth and survival counts, format must include a forward slash <Survival Digits>/<Birth Digits> ";
    }
    const survivalNums = [];
    const birthNums = [];
    if (sides[0].length > 0) {
        if (sides[0][0] === "S") {
            survivalNums.push(...sides[0].substring(1).split('').map(numChar => Number.parseInt(numChar)));
        }
        else {
            survivalNums.push(...sides[0].split('').map(numChar => Number.parseInt(numChar)));
        }
    }
    if (sides[1].length > 0) {
        if (sides[0][0] === "B") {
            birthNums.push(...sides[1].substring(1).split('').map(numChar => Number.parseInt(numChar)));
        }
        else {
            birthNums.push(...sides[1].split('').map(numChar => Number.parseInt(numChar)));
        }
    }
    if (survivalNums.some(num => isNaN(num)) || birthNums.some(num => isNaN(num))) {
        return `Must include only numbers before and after the slash "/" in S/B notation (<Survival Digits>/<Birth Digits>)`;
    }
    if (survivalNums.some(num => num === 9) || birthNums.some(num => num === 9)) {
        return `9 is an invalid input for s/b notation string`;
    }
    const survivalSet = new Set(survivalNums);
    const birthSet = new Set(birthNums);
    if (survivalSet.size !== survivalNums.length && birthSet.size !== birthNums.length) {
        return "Replicate number on both sides of <Survival Digits>/<Birth Digits> ";
    }
    else if (survivalSet.size !== survivalNums.length && birthSet.size === birthNums.length) {
        return "Replicate number on Survival side of <Survival Digits>/<Birth Digits> ";
    }
    else if (survivalSet.size === survivalNums.length && birthSet.size !== birthNums.length) {
        return "Replicate number on Birth side of <Survival Digits>/<Birth Digits> ";
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
        if (sides[0] === "S" && sides[1] === "B") {
            return {
                birth: sides[0].substring(1).split("").map(digit => Number.parseInt(digit)),
                survival: sides[1].substring(1).split("").map(digit => Number.parseInt(digit))
            };
        }
        return {
            birth: sides[0].split("").map(digit => Number.parseInt(digit)),
            survival: sides[1].split("").map(digit => Number.parseInt(digit))
        };
    }
    throw new Error(`[readSBRuleString] Error while parsing s/b notation ruleString: ${getSBLifeStringError(lifeString)}`);
}
exports.readSBRuleString = readSBRuleString;
