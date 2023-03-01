

// further reading at https://conwaylife.com/wiki/Rulestring

import { getErrorMessage } from "../core/util";

type LifeRuleData = { birth: number[], survival: number[] }
type LifeRuleStringNotation = "B/S" | "S/B"

export function isLifeRuleString(lifeString: string, format: LifeRuleStringNotation | "" = "") {
    switch (format) {
        case "B/S": return isValidBSLifeString(lifeString);
        case "S/B": return isValidSBLifeString(lifeString);
        case "": return isValidBSLifeString(lifeString) || isValidSBLifeString(lifeString);
    }
}

export function readLifeRuleString(lifeString: string, format: LifeRuleStringNotation | "" = ""): LifeRuleData {
    switch (format) {
        case "B/S": return parseBSLifeLikeString(lifeString);
        case "S/B": return parseSBLifeLikeString(lifeString);
        case "": { 
            if (isValidBSLifeString(lifeString)) {
                return parseBSLifeLikeString(lifeString);
            } else if (isValidSBLifeString(lifeString)) {
                return parseSBLifeLikeString(lifeString);
            }
            throw new Error(`Could not parse Life String: ${lifeString}, could not find a fitting format (Available formats are B/S and S/B, read at https://conwaylife.com/wiki/Rulestring)`);
        }
    }
}

export function makeLifeRuleString(birthNums: number[], survivalNums: number[], format: LifeRuleStringNotation): string {
    try {
        switch (format) {
            case "B/S": return makeBSLifeString(birthNums, survivalNums)
            case "S/B": return makeSBLifeString(birthNums, survivalNums)
        }
    } catch (e) {
        throw new Error(`Could not make life rule string from birth rules: (${birthNums}) and survival rules: (${survivalNums}) : ${getErrorMessage(e)}`)
    }
}   

export function isValidBSLifeString(lifeString: string, errorOutput?: (error: string) => any) {
    const error = getBSLifeStringError(lifeString);
    if (error.length > 0) {
        errorOutput?.(error)
        return false;
    }
    return true;
}

export function getBSLifeStringError(lifeString: string): string {
    const sides = lifeString.split("/");
    if (sides.length !== 2) {
        return "Error: Not able to split string into birth and survival counts, format must include a forward slash B<NUMS>/S<NUMS> "
    } else if (sides[0].charAt(0) !== "B" || sides[1].charAt(0) !== "S") {
       return "Error: B and S are backwards, please switch to B<NUMS>/S<NUMS> "
    } else if (sides[0].substring(1).split('').some((char: string) => isNaN(Number.parseInt(char))) || sides[1].substring(1).split('').some((char: string) => isNaN(Number.parseInt(char)))) {
       return "Error: Must include numbers after B and after /S B<NUMS>/S<NUMS> "
    } else if (new Set<string>(sides[0].substring(1).split('')).size !== sides[0].length - 1 || new Set<string>(sides[1].substring(1).split('')).size !== sides[1].length - 1) {
       return "Error: Replicate number on one side of B<NUMS>/S<NUMS> "
    }

    return "";
}

// NOTE: SWITCHED VARIABLES
export function getCanMakeLifeStringError(birthNums: number[], survivalNums: number[]): string {
    if (survivalNums.some(num => num < 0 || num > 8)) {
        return "Survival neighborhood rules must be between 0 and 8";
    }
    if (birthNums.some(num => num < 0 || num > 8)) {
        return "Birth neighborhood rules must be between 0 and 8";
    }
    if (survivalNums.length > 8) {
        return "Can only have 8 maximum survival rules";
    }
    if (birthNums.length > 8) {
        return "Can only have 8 maximum birth rules";
    }
    if (survivalNums.length !== new Set<number>(survivalNums).size) {
        return "Not all survival rules are unique";
    }
    if (birthNums.length !== new Set<number>(birthNums).size) {
        return "Not all birth rules are unique";
    }
    

    return "";
}

export function canMakeLifeString(birthNums: number[], survivalNums: number[]): boolean {
    return getCanMakeLifeStringError(birthNums, survivalNums) === ""
}

export function makeBSLifeString(birthNums: number[], survivalNums: number[]): string {
    if (!canMakeLifeString(birthNums, survivalNums)) {
        throw new Error(`Cannot make new life string from ${survivalNums} and ${birthNums}: ${getCanMakeLifeStringError(birthNums, survivalNums)}`);
    }
    
    return "B".concat( birthNums.join("")  ).concat('/S').concat( survivalNums.join("") );
}

export function parseBSLifeLikeString(lifeString: string): LifeRuleData {
    let lifeData: LifeRuleData = {birth: [], survival: []};
    if (!isValidBSLifeString(lifeString)) {
        return lifeData;
    } 

   const [ birth, survival ] = lifeString.split("/");
    
    for (let i = 1; i < birth.length; i++) {
        const num: number = Number.parseInt(birth.charAt(i));
        lifeData.birth.push(num);
    }


    for (let i = 1; i < survival.length; i++) {
        const num: number = Number.parseInt(survival.charAt(i));
        lifeData.survival.push(num);
    }

    return lifeData;
}

function getSBLifeStringError(lifeString: string): string {
    const sides = lifeString.split("/");
    if (sides.length !== 2) {
        return "Error: Not able to split S/B life-like rule string into birth and survival counts, format must include a forward slash <NUMS>/<NUMS> "
    } else if (sides[0].split('').some((char: string) => isNaN(Number.parseInt(char))) || sides[1].split('').some((char: string) => isNaN(Number.parseInt(char)))) {
       return "Error: Must include numbers after B and after /S B<NUMS>/S<NUMS> "
    } else if (new Set<string>(sides[0].split('')).size !== sides[0].length || new Set<string>(sides[1].split('')).size !== sides[1].length) {
       return "Error: Replicate number on one side of B<NUMS>/S<NUMS> "
    }

    return "";
}

function isValidSBLifeString(lifeString: string): boolean {
    return getSBLifeStringError(lifeString) === ""
}

function makeSBLifeString(birthNums: number[], survivalNums: number[]): string {
    if (canMakeLifeString(birthNums, survivalNums)) {

    }
}

function parseSBLifeLikeString(lifeString: string): LifeRuleData {
    if (isValidSBLifeString(lifeString)) {
        const sides = lifeString.split("/")
        return {
            birth: sides[0].split("").map(digit => Number.parseInt(digit)),
            survival: sides[1].split("").map(digit => Number.parseInt(digit))
        }
    }
    throw new Error(getSBLifeStringError(lifeString))
}