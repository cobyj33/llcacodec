"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.readBSRuleString = exports.makeBSLifeString = exports.isValidBSLifeString = exports.getBSLifeStringError = exports.CONWAY_RULE_STRING_BS = void 0;
const ruleData_1 = require("./ruleData");
exports.CONWAY_RULE_STRING_BS = "B3/S23";
/**
 *
 * @param lifeString The B/S notation life rule to test for errors
 *
 * @note These errors are very much not guaranteed to remain the same over releases. However, this function will always return an empty string when given a life rule without errors.
 * @returns An error describing problems with the B/S notation lifeString, or an empty string if the lifeString has no errors
 */
function getBSLifeStringError(lifeString) {
    const sides = lifeString.split("/");
    if (sides.length < 2) {
        return `Not able to split string into birth and survival counts, format must include a forward slash (B/S Notation: B<NUMS>/S<NUMS>) (got: ${lifeString})`;
    }
    if (sides.length > 2) {
        return `Not able to split string into birth and survival counts, format must include a forward slash (b/s Notation: B<NUMS>/S<NUMS>) (got: ${lifeString})`;
    }
    if (sides[0].charAt(0).toLowerCase() !== "b" || sides[1].charAt(0).toLowerCase() !== "s") {
        return `B and S not declared correctly, please switch to B<NUMS>/S<NUMS>  (b/s Notation: B<NUMS>/S<NUMS>) (got: ${lifeString})`;
    }
    const birthNums = sides[0].substring(1).split('').map(numChar => Number.parseInt(numChar));
    const survivalNums = sides[1].substring(1).split('').map(numChar => Number.parseInt(numChar));
    if (birthNums.some(num => isNaN(num)) || survivalNums.some(num => isNaN(num))) {
        return `Must include numbers after B and after /S B<NUMS>/S<NUMS>. Found NaN (b/s Notation: B<NUMS>/S<NUMS>) (got: ${lifeString})`;
    }
    if (birthNums.some(num => num < 0 || num > 8) || survivalNums.some(num => num < 0 || num > 8)) {
        return `All rule numbers must lie in the range 0 <= num <= 8 (b/s Notation: B<NUMS>/S<NUMS>) (got: ${lifeString})`;
    }
    if (new Set(birthNums).size !== birthNums.length || new Set(survivalNums).size !== survivalNums.length) {
        return `Replicate number on one side of B<NUMS>/S<NUMS>. All numbers must be unique (b/s Notation: B<NUMS>/S<NUMS>) (got: ${lifeString})`;
    }
    return "";
}
exports.getBSLifeStringError = getBSLifeStringError;
function isValidBSLifeString(lifeString) {
    return getBSLifeStringError(lifeString) === "";
}
exports.isValidBSLifeString = isValidBSLifeString;
function makeBSLifeString(lifeRuleData) {
    const { birth, survival } = lifeRuleData;
    if ((0, ruleData_1.isValidLifeRuleData)(lifeRuleData)) {
        return `B${[...birth].sort((a, b) => a - b).join("")}/S${[...survival].sort((a, b) => a - b).join("")}`;
    }
    throw new Error(`Cannot make new life string from (birth: [${birth}]) and (survival: [${survival}]): ${(0, ruleData_1.getLifeRuleDataError)(lifeRuleData)}`);
}
exports.makeBSLifeString = makeBSLifeString;
function readBSRuleString(lifeString) {
    if (isValidBSLifeString(lifeString)) {
        let lifeData = { birth: [], survival: [] };
        const [birth, survival] = lifeString.split("/");
        for (let i = 1; i < birth.length; i++) {
            const num = Number.parseInt(birth.charAt(i));
            lifeData.birth.push(num);
        }
        for (let i = 1; i < survival.length; i++) {
            const num = Number.parseInt(survival.charAt(i));
            lifeData.survival.push(num);
        }
        return lifeData;
    }
    throw new Error("");
}
exports.readBSRuleString = readBSRuleString;
