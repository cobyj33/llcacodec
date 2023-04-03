import { LifeRuleData, getLifeRuleDataError, isValidLifeRuleData } from "./ruleData";

export const CONWAY_RULE_STRING_SB = "23/3"
export type SBStringNotation = "s/b"


export function getSBLifeStringError(lifeString: string): string | "" {
    const sides = lifeString.split("/");
    if (sides.length !== 2) {
        return `Not able to split s/b life-like rule string into birth and survival counts, format must include a forward slash <Survival Digits>/<Birth Digits> (got: ${lifeString})`
    }

    const survivalNums: number[] = []
    const birthNums: number[] = []

    if (sides[0].length > 0) {
        if (sides[0][0].toUpperCase() === "S") {
            survivalNums.push(...sides[0].substring(1).split('').map(numChar => Number.parseInt(numChar)))
        } else {
            survivalNums.push(...sides[0].split('').map(numChar => Number.parseInt(numChar)))
        }
    }

    if (sides[1].length > 0) {
        if (sides[1][0].toUpperCase() === "B") {
            birthNums.push(...sides[1].substring(1).split('').map(numChar => Number.parseInt(numChar)))
        } else {
            birthNums.push(...sides[1].split('').map(numChar => Number.parseInt(numChar)))
        }
    }

    if (survivalNums.some(num => isNaN(num)) || birthNums.some(num => isNaN(num))) {
       return `Must include only numbers before and after the slash "/" in S/B notation (<Survival Digits>/<Birth Digits>) (got: ${lifeString})`
    } else if (survivalNums.some(num => num === 9) || birthNums.some(num => num === 9)) {
        return `9 is an invalid input for s/b notation string (got: ${lifeString})`
    } else if (new Set<number>(survivalNums).size !== survivalNums.length || new Set<number>(birthNums).size !== birthNums.length) {
       return `Replicate number on side of <Survival Digits>/<Birth Digits> (got ${lifeString})`
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
        const sides = lifeString.split("/") as [string, string]
        return {
            survival: sides[0].substring(sides[0].length > 0 && sides[0][0].toUpperCase() === "S" ? 1 : 0).split("").map(digit => Number.parseInt(digit)),
            birth: sides[1].substring(sides[1].length > 0 && sides[1][0].toUpperCase() === "B" ? 1 : 0).split("").map(digit => Number.parseInt(digit))
        }
    }
    throw new Error(`[readSBRuleString] Error while parsing s/b notation ruleString: ${getSBLifeStringError(lifeString)}`)
}