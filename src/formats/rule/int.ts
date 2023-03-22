import { LifeRuleData, getLifeRuleDataError, isValidLifeRuleData } from "./ruleData";


export const MAX_LIFE_INTEGER = 131071; // 2^17 - 1
export const CONWAY_LIFE_RULE_INTEGER = 6152

function getLifeRuleIntegerError(lifeInteger: number): string | "" {
    if (!Number.isInteger(lifeInteger)) {
        return "Life integer is not an integer value"
    }
    if (lifeInteger > MAX_LIFE_INTEGER) {
        return `Life integer is an integer greater than maximum value of 2^16 - 1 (${MAX_LIFE_INTEGER})`
    }
    if (lifeInteger < 0) {
        return "Life integer is an integer less than 0"
    }

    return ""
}

export function isValidLifeRuleInteger(lifeInteger: number) {
    return getLifeRuleIntegerError(lifeInteger) === ""
}

export function readLifeRuleInteger(lifeInteger: number): LifeRuleData {
    if (isValidLifeRuleInteger(lifeInteger)) {
        const birthRules = lifeInteger & 0xff
        const survivalRules = (lifeInteger & 0xff00) >> 9
        const lifeRuleData: LifeRuleData = { birth: [], survival: [] }

        for (let i = 0; i <= 8; i++) {
            if (birthRules & 1 << i) {
                lifeRuleData.birth.push(i)
            }
            if (survivalRules & 1 << i) {
                lifeRuleData.survival.push(i);
            }
        }

        return lifeRuleData
    }
    throw new Error(`Could not read life rule integer: ${getLifeRuleIntegerError(lifeInteger)}`)
}

export function makeLifeRuleInteger(lifeRuleData: LifeRuleData): number {
    const BIRTH_OFFSET = 0;
    const SURVIVAL_OFFSET = 9;
    if (isValidLifeRuleData(lifeRuleData)) {
        let rule = 0;
        const { birth, survival } = lifeRuleData

        birth.forEach(ruleVal => {
            rule |= 1 << (ruleVal + BIRTH_OFFSET)
        })

        survival.forEach(ruleVal => {
            rule |= 1 << (ruleVal + SURVIVAL_OFFSET)
        })

        return rule;
    }

    throw new Error(`Could not make life rule integer from ${JSON.stringify(lifeRuleData)}: ${getLifeRuleDataError(lifeRuleData)}`)
}