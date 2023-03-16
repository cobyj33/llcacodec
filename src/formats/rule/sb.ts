import { LifeRuleData, getLifeRuleDataError, isValidLifeRuleData } from "formats/rule/ruleData";

export const CONWAY_RULE_STRING_SB = "23/3"
export type SBStringNotation = "s/b"


export function getSBLifeStringError(lifeString: string): string | "" {
    const sides = lifeString.split("/");
    if (sides.length !== 2) {
        return "Not able to split s/b life-like rule string into birth and survival counts, format must include a forward slash <NUMS>/<NUMS> "
    }

    const survivalNums = sides[0].split('').map(numChar => Number.parseInt(numChar))
    const birthNums = sides[1].split('').map(numChar => Number.parseInt(numChar))
    
    if (survivalNums.some(num => isNaN(num)) || birthNums.some(num => isNaN(num))) {
       return "Must include only numbers before and after the slash / (<NUMS>/<NUMS>)"
    } 

    if (survivalNums.some(num => num === 9) || birthNums.some(num => num === 9)) {
        return `9 is an invalid input for s/b notation string`
    }
    
    if (new Set<number>(survivalNums).size !== survivalNums.length || new Set<number>(birthNums).size !== birthNums.length) {
       return "Replicate number on one side of <NUMS>/<NUMS> "
    }

    return "";
}

export function isValidSBLifeString(lifeString: string): boolean {
    return getSBLifeStringError(lifeString) === ""
}

export function makeSBLifeString(lifeRuleData: LifeRuleData): string {
    const { birth, survival } = lifeRuleData
    if (isValidLifeRuleData(lifeRuleData)) {
        return `${[...survival].sort((a, b) => a - b).map(num => num.toString()).join("")}/${[...birth].sort((a, b) => a - b).map(num => num.toString()).join("")}`
    }
    throw new Error(`[makeSBLifeString] Error while creating lifeString from (${JSON.stringify(lifeRuleData)}), ${getLifeRuleDataError(lifeRuleData)}`)
}

export function readSBRuleString(lifeString: string): LifeRuleData {
    if (isValidSBLifeString(lifeString)) {
        const sides = lifeString.split("/")
        return {
            birth: sides[0].split("").map(digit => Number.parseInt(digit)),
            survival: sides[1].split("").map(digit => Number.parseInt(digit))
        }
    }
    throw new Error(`[readSBRuleString] Error while parsing s/b notation ruleString: ${getSBLifeStringError(lifeString)}`)
}