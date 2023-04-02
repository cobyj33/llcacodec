import { CONWAY_RULE_STRING_BS, isValidBSLifeString, makeBSLifeString, readBSRuleString } from "./bs";
import { CONWAY_RULE_STRING_SB, isValidSBLifeString, makeSBLifeString, readSBRuleString } from "./sb";
import { CONWAY_LIFE_RULE_INTEGER, isValidLifeRuleInteger, makeLifeRuleInteger, readLifeRuleInteger } from "./int"
import { CONWAY_LIFE_RULE_DATA, LifeRuleData } from "./ruleData";
import { getErrorMessage } from "../../core/util";

export { CONWAY_LIFE_RULE_DATA, CONWAY_RULE_STRING_BS, CONWAY_RULE_STRING_SB, LifeRuleData, CONWAY_LIFE_RULE_INTEGER }

export type LifeRuleStringNotation = "b/s" | "s/b" | "int"

export function isValidLifeRule(rule: string, format: "b/s"): boolean
export function isValidLifeRule(rule: string, format: "s/b"): boolean
export function isValidLifeRule(rule: number, format: "int"): boolean
export function isValidLifeRule(rule: string | number, format?: ""): boolean
export function isValidLifeRule(rule: string | number, format: LifeRuleStringNotation | "" = ""): boolean {
    const foundFormat = format === "" ? getLifeRuleFormat(rule) : format
    if (foundFormat === "N/A") {
        return false;
    }

    if (typeof(rule) === "number") {
        if (foundFormat !== "int") {
            return false;
        }
        return isValidLifeRuleInteger(rule)
    }

    if (typeof(rule) === "string") {
        switch (foundFormat) {
            case "b/s": return isValidBSLifeString(rule);
            case "s/b": return isValidSBLifeString(rule);
        }
    }
    return false;
}

export function getLifeRuleFormat(rule: string | number): LifeRuleStringNotation | "N/A" {
    if (typeof(rule) === "string") {
        if (isValidBSLifeString(rule)) {
            return "b/s";
        } else if (isValidSBLifeString(rule)) {
            return "s/b"
        }
    }
    else if (typeof(rule) === "number") {
        if (isValidLifeRuleInteger(rule)) {
            return "int"
        }
    }

    return "N/A"
}

export function readLifeRule(rule: string | number, format: LifeRuleStringNotation | "" = ""): LifeRuleData {
    const foundFormat = format === "" ? getLifeRuleFormat(rule) : format
    if (foundFormat === "N/A") {
        throw new Error(`Could not parse Life String: ${rule}, could not find a fitting format (Available formats are "b/s", "s/b", and "int"), read at https://conwaylife.com/wiki/Rulestring https://conwaylife.com/wiki/Rule_integer)`);
    }

    if (typeof(rule) === "number") {
        if (format !== "int" && format !== "") { // requested a string-based format with an integer value
            throw new Error(`Could not read rule ${rule} in requested format ${format}, as the integer value ${rule} cannot be in the ${format} string format`)
        }
        return readLifeRuleInteger(rule)
    }

    switch (foundFormat) {
        case "b/s": return readBSRuleString(rule);
        case "s/b": return readSBRuleString(rule);
    }
    
    throw new Error(`Could not parse Life String: ${rule}, could not find a fitting format (Available formats are "b/s", "s/b", and "int"), read at https://conwaylife.com/wiki/Rulestring https://conwaylife.com/wiki/Rule_integer)`);
}

export function makeLifeRule(lifeRuleData: LifeRuleData, format: "b/s"): string
export function makeLifeRule(lifeRuleData: LifeRuleData, format: "s/b"): string
export function makeLifeRule(lifeRuleData: LifeRuleData, format: "int"): number
export function makeLifeRule(lifeRuleData: LifeRuleData, format: LifeRuleStringNotation): string | number
export function makeLifeRule(lifeRuleData: LifeRuleData, format: LifeRuleStringNotation): string | number {
    try {
        switch (format) {
            case "b/s": return makeBSLifeString(lifeRuleData)
            case "s/b": return makeSBLifeString(lifeRuleData)
            case "int": return makeLifeRuleInteger(lifeRuleData)
        }
    } catch (e) {
        throw new Error(`Could not make life rule string from life rule data object: (${JSON.stringify(lifeRuleData)}) : ${getErrorMessage(e)}`)
    }
}

export function convertLifeRule(original: string | number, dstFormat: "b/s"): string
export function convertLifeRule(original: string | number, dstFormat: "s/b"): string
export function convertLifeRule(original: string | number, dstFormat: "int"): number
export function convertLifeRule(original: string | number, dstFormat: LifeRuleStringNotation): string | number {
    const lifeRuleData = readLifeRule(original);
    return makeLifeRule(lifeRuleData, dstFormat);
}