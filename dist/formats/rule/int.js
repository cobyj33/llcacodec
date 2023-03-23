"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeLifeRuleInteger = exports.readLifeRuleInteger = exports.isValidLifeRuleInteger = exports.CONWAY_LIFE_RULE_INTEGER = exports.MAX_LIFE_INTEGER = void 0;
const ruleData_1 = require("./ruleData");
exports.MAX_LIFE_INTEGER = 131071; // 2^17 - 1
exports.CONWAY_LIFE_RULE_INTEGER = 6152;
function getLifeRuleIntegerError(lifeInteger) {
    if (!Number.isInteger(lifeInteger)) {
        return "Life integer is not an integer value";
    }
    if (lifeInteger > exports.MAX_LIFE_INTEGER) {
        return `Life integer is an integer greater than maximum value of 2^16 - 1 (${exports.MAX_LIFE_INTEGER})`;
    }
    if (lifeInteger < 0) {
        return "Life integer is an integer less than 0";
    }
    return "";
}
function isValidLifeRuleInteger(lifeInteger) {
    return getLifeRuleIntegerError(lifeInteger) === "";
}
exports.isValidLifeRuleInteger = isValidLifeRuleInteger;
function readLifeRuleInteger(lifeInteger) {
    if (isValidLifeRuleInteger(lifeInteger)) {
        const birthRules = lifeInteger & 0xff;
        const survivalRules = (lifeInteger & 0xff00) >> 9;
        const lifeRuleData = { birth: [], survival: [] };
        for (let i = 0; i <= 8; i++) {
            if (birthRules & 1 << i) {
                lifeRuleData.birth.push(i);
            }
            if (survivalRules & 1 << i) {
                lifeRuleData.survival.push(i);
            }
        }
        return lifeRuleData;
    }
    throw new Error(`Could not read life rule integer: ${getLifeRuleIntegerError(lifeInteger)}`);
}
exports.readLifeRuleInteger = readLifeRuleInteger;
function makeLifeRuleInteger(lifeRuleData) {
    const BIRTH_OFFSET = 0;
    const SURVIVAL_OFFSET = 9;
    if ((0, ruleData_1.isValidLifeRuleData)(lifeRuleData)) {
        let rule = 0;
        const { birth, survival } = lifeRuleData;
        birth.forEach(ruleVal => {
            rule |= 1 << (ruleVal + BIRTH_OFFSET);
        });
        survival.forEach(ruleVal => {
            rule |= 1 << (ruleVal + SURVIVAL_OFFSET);
        });
        return rule;
    }
    throw new Error(`Could not make life rule integer from ${JSON.stringify(lifeRuleData)}: ${(0, ruleData_1.getLifeRuleDataError)(lifeRuleData)}`);
}
exports.makeLifeRuleInteger = makeLifeRuleInteger;
