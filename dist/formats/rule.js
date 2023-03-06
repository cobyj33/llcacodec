"use strict";
// further reading at https://conwaylife.com/wiki/Rulestring
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLifeStringError = exports.canMakeLifeString = exports.getCanMakeLifeStringError = exports.makeLifeRuleString = exports.readLifeRuleString = exports.getLifeRuleStringFormat = exports.isValidLifeRuleString = void 0;
const util_1 = require("../core/util");
function isValidLifeRuleString(lifeString, format = "") {
    switch (format) {
        case "B/S": return isValidBSLifeString(lifeString);
        case "S/B": return isValidSBLifeString(lifeString);
        case "": return isValidBSLifeString(lifeString) || isValidSBLifeString(lifeString);
    }
}
exports.isValidLifeRuleString = isValidLifeRuleString;
function getLifeRuleStringFormat(lifeString) {
    if (isValidBSLifeString(lifeString)) {
        return "B/S";
    }
    else if (isValidSBLifeString(lifeString)) {
        return "S/B";
    }
    return "N/A";
}
exports.getLifeRuleStringFormat = getLifeRuleStringFormat;
function readLifeRuleString(lifeString, format = "") {
    switch (format) {
        case "B/S": return parseBSLifeLikeString(lifeString);
        case "S/B": return parseSBLifeLikeString(lifeString);
        case "": {
            if (isValidBSLifeString(lifeString)) {
                return parseBSLifeLikeString(lifeString);
            }
            else if (isValidSBLifeString(lifeString)) {
                return parseSBLifeLikeString(lifeString);
            }
            throw new Error(`Could not parse Life String: ${lifeString}, could not find a fitting format (Available formats are B/S and S/B, read at https://conwaylife.com/wiki/Rulestring)`);
        }
    }
}
exports.readLifeRuleString = readLifeRuleString;
function makeLifeRuleString(birthNums, survivalNums, format) {
    try {
        switch (format) {
            case "B/S": return makeBSLifeString(birthNums, survivalNums);
            case "S/B": return makeSBLifeString(birthNums, survivalNums);
        }
    }
    catch (e) {
        throw new Error(`Could not make life rule string from birth rules: (${birthNums}) and survival rules: (${survivalNums}) : ${(0, util_1.getErrorMessage)(e)}`);
    }
}
exports.makeLifeRuleString = makeLifeRuleString;
// NOTE: SWITCHED VARIABLES
function getCanMakeLifeStringError(birthNums, survivalNums) {
    if (survivalNums.some(num => num < 0 || num > 8)) {
        return "Survival neighborhood rules must be between 0 and 8";
    }
    if (birthNums.some(num => num < 0 || num > 8)) {
        return "Birth neighborhood rules must be between 0 and 8";
    }
    if (survivalNums.some(num => isNaN(num))) {
        return "Survival neighborhood rules cannot contain NaN";
    }
    if (birthNums.some(num => isNaN(num))) {
        return "Birth neighborhood rules cannot contain NaN";
    }
    if (survivalNums.some(num => !Number.isInteger(num))) {
        return "Survival neighborhood rules must be integer values";
    }
    if (birthNums.some(num => !Number.isInteger(num))) {
        return "Birth neighborhood rules must be integer values";
    }
    if (survivalNums.length > 8) {
        return "Can only have 8 maximum survival rules";
    }
    if (birthNums.length > 8) {
        return "Can only have 8 maximum birth rules";
    }
    if (survivalNums.length !== new Set(survivalNums).size) {
        return "Not all survival rules are unique";
    }
    if (birthNums.length !== new Set(birthNums).size) {
        return "Not all birth rules are unique";
    }
    return "";
}
exports.getCanMakeLifeStringError = getCanMakeLifeStringError;
function canMakeLifeString(birthNums, survivalNums) {
    return getCanMakeLifeStringError(birthNums, survivalNums) === "";
}
exports.canMakeLifeString = canMakeLifeString;
function getLifeStringError(lifeString, format) {
    switch (format) {
        case "B/S": return getBSLifeStringError(lifeString);
        case "S/B": return getSBLifeStringError(lifeString);
    }
}
exports.getLifeStringError = getLifeStringError;
function isValidBSLifeString(lifeString) {
    return getBSLifeStringError(lifeString) === "";
}
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
        return `B/S RuleString Error: Not able to split string into birth and survival counts, format must include a forward slash (B/S Notation: B<NUMS>/S<NUMS>) (got: ${lifeString})`;
    }
    if (sides.length > 2) {
        return `B/S RuleString Error: Not able to split string into birth and survival counts, format must include a forward slash (B/S Notation: B<NUMS>/S<NUMS>) (got: ${lifeString})`;
    }
    if (sides[0].charAt(0).toLowerCase() !== "b" || sides[1].charAt(0).toLowerCase() !== "s") {
        return `B/S RuleString Error: B and S not declared correctly, please switch to B<NUMS>/S<NUMS>  (B/S Notation: B<NUMS>/S<NUMS>) (got: ${lifeString})`;
    }
    const birthNums = sides[0].substring(1).split('').map(numChar => Number.parseInt(numChar));
    const survivalNums = sides[1].substring(1).split('').map(numChar => Number.parseInt(numChar));
    if (birthNums.some(num => isNaN(num)) || survivalNums.some(num => isNaN(num))) {
        return `B/S RuleString Error: Must include numbers after B and after /S B<NUMS>/S<NUMS>. Found NaN (B/S Notation: B<NUMS>/S<NUMS>) (got: ${lifeString})`;
    }
    if (birthNums.some(num => num < 0 || num > 8) || survivalNums.some(num => num < 0 || num > 8)) {
        return `B/S RuleString Error: All rule numbers must lie in the range 0 <= num <= 8 (B/S Notation: B<NUMS>/S<NUMS>) (got: ${lifeString})`;
    }
    if (new Set(birthNums).size !== birthNums.length || new Set(survivalNums).size !== survivalNums.length) {
        return `B/S RuleString Error: Replicate number on one side of B<NUMS>/S<NUMS>. All numbers must be unique (B/S Notation: B<NUMS>/S<NUMS>) (got: ${lifeString})`;
    }
    return "";
}
function makeBSLifeString(birthNums, survivalNums) {
    if (canMakeLifeString(birthNums, survivalNums)) {
        return `B${[...birthNums].sort((a, b) => a - b).join("")}/S${[...survivalNums].sort((a, b) => a - b).join("")}`;
    }
    throw new Error(`Cannot make new life string from (birthNums: [${birthNums}]) and (survivalNums: [${survivalNums}]): ${getCanMakeLifeStringError(birthNums, survivalNums)}`);
}
function parseBSLifeLikeString(lifeString) {
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
function getSBLifeStringError(lifeString) {
    const sides = lifeString.split("/");
    if (sides.length !== 2) {
        return "Error: Not able to split S/B life-like rule string into birth and survival counts, format must include a forward slash <NUMS>/<NUMS> ";
    }
    const survivalNums = sides[0].split('').map(numChar => Number.parseInt(numChar));
    const birthNums = sides[1].split('').map(numChar => Number.parseInt(numChar));
    if (survivalNums.some(num => isNaN(num)) || birthNums.some(num => isNaN(num))) {
        return "Error: Must include only numbers before and after the slash / (<NUMS>/<NUMS>)";
    }
    if (survivalNums.some(num => num === 9) || birthNums.some(num => num === 9)) {
        return `Error: 9 is an invalid input for S/B notation string`;
    }
    if (new Set(survivalNums).size !== survivalNums.length || new Set(birthNums).size !== birthNums.length) {
        return "Error: Replicate number on one side of <NUMS>/<NUMS> ";
    }
    return "";
}
function isValidSBLifeString(lifeString) {
    return getSBLifeStringError(lifeString) === "";
}
function makeSBLifeString(birthNums, survivalNums) {
    if (canMakeLifeString(birthNums, survivalNums)) {
        return `${[...survivalNums].sort((a, b) => a - b).map(num => num.toString()).join("")}/${[...birthNums].sort((a, b) => a - b).map(num => num.toString()).join("")}`;
    }
    throw new Error(`[makeSBLifeString] Error while creating lifeString from (birthNums: [${birthNums}]) and (survivalNums: [${survivalNums}]), ${getCanMakeLifeStringError(birthNums, survivalNums)}`);
}
function parseSBLifeLikeString(lifeString) {
    if (isValidSBLifeString(lifeString)) {
        const sides = lifeString.split("/");
        return {
            birth: sides[0].split("").map(digit => Number.parseInt(digit)),
            survival: sides[1].split("").map(digit => Number.parseInt(digit))
        };
    }
    throw new Error(`[parseSBLifeLikeString] Error while parsing S/B notation ruleString: ${getSBLifeStringError(lifeString)}`);
}
