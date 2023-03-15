import { BSStringNotation, CONWAY_RULE_STRING_BS, getBSLifeStringError, isValidBSLifeString, makeBSLifeString, parseBSLifeLikeString } from "./bs";
import { CONWAY_RULE_STRING_SB, SBStringNotation, getSBLifeStringError, isValidSBLifeString, makeSBLifeString, parseSBLifeLikeString } from "./sb";
import { getErrorMessage } from "../../core/util";
import { CONWAY_LIFE_RULE_DATA, LifeRuleData } from "./ruleData";

export { CONWAY_LIFE_RULE_DATA, CONWAY_RULE_STRING_BS, CONWAY_RULE_STRING_SB, LifeRuleData  }

export type LifeRuleStringNotation = BSStringNotation | SBStringNotation

export function isValidLifeRuleString(lifeString: string, format: LifeRuleStringNotation | "" = ""): boolean {
    switch (format) {
        case "B/S": return isValidBSLifeString(lifeString);
        case "S/B": return isValidSBLifeString(lifeString);
        case "": return isValidBSLifeString(lifeString) || isValidSBLifeString(lifeString);
    }
}

export function getLifeRuleStringFormat(lifeString: string): LifeRuleStringNotation | "N/A" {
    if (isValidBSLifeString(lifeString)) {
        return "B/S";
    } else if (isValidSBLifeString(lifeString)) {
        return "S/B"
    }
    return "N/A"
}

export function readLifeRuleString(lifeString: string, format: LifeRuleStringNotation | "" = ""): LifeRuleData {
    const foundFormat = format === "" ? getLifeRuleStringFormat(lifeString) : format
    switch (foundFormat) {
        case "B/S": return parseBSLifeLikeString(lifeString);
        case "S/B": return parseSBLifeLikeString(lifeString);
        case "N/A": throw new Error(`Could not parse Life String: ${lifeString}, could not find a fitting format (Available formats are B/S and S/B, read at https://conwaylife.com/wiki/Rulestring)`);
    }
}


export function makeLifeRuleString(lifeRuleData: LifeRuleData, format: LifeRuleStringNotation): string {
    try {
        switch (format) {
            case "B/S": return makeBSLifeString(lifeRuleData)
            case "S/B": return makeSBLifeString(lifeRuleData)
        }
    } catch (e) {
        throw new Error(`Could not make life rule string from life rule data object: (${JSON.stringify(lifeRuleData)}) : ${getErrorMessage(e)}`)
    }
}