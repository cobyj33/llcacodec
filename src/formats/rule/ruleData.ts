
export const CONWAY_LIFE_RULE_DATA = () => ({ birth: [3], survival: [2, 3]})
export type LifeRuleData = { birth: number[], survival: number[] }


export function getLifeRuleDataError({ birth, survival }: LifeRuleData): string | "" {
    if (survival.some(num => num < 0 || num > 8)) {
        return "Survival neighborhood rules must be between 0 and 8";
    }
    if (birth.some(num => num < 0 || num > 8)) {
        return "Birth neighborhood rules must be between 0 and 8";
    }

    if (survival.some(num => isNaN(num))) {
        return "Survival neighborhood rules cannot contain NaN";
    }
    if (birth.some(num => isNaN(num))) {
        return "Birth neighborhood rules cannot contain NaN";
    }

    if (survival.some(num => !Number.isInteger(num))) {
        return "Survival neighborhood rules must be integer values";
    }
    if (birth.some(num => !Number.isInteger(num))) {
        return "Birth neighborhood rules must be integer values";
    }

    if (survival.length > 8) {
        return "Can only have 8 maximum survival rules";
    }
    if (birth.length > 8) {
        return "Can only have 8 maximum birth rules";
    }

    if (survival.length !== new Set<number>(survival).size) {
        return "Not all survival rules are unique";
    }
    if (birth.length !== new Set<number>(birth).size) {
        return "Not all birth rules are unique";
    }

    return "";
}

export function isLifeRuleDataType(obj: unknown): obj is LifeRuleData {
    return typeof(obj) === "object" && obj !== null && "birth" in obj && "survival" in obj && Array.isArray(obj.birth) && Array.isArray(obj.survival)
}

/**
 * 
 * The validity of a LifeRuleData object is given
 * 
 * @param lifeRuleData The LifeRuleData object to validate
 * @returns Whether the provided LifeRuleData object is valid
 */
export function isValidLifeRuleData(lifeRuleData: LifeRuleData): boolean {
    return getLifeRuleDataError(lifeRuleData) === ""
}