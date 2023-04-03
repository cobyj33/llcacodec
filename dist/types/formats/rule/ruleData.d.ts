export declare const CONWAY_LIFE_RULE_DATA: () => {
    birth: number[];
    survival: number[];
};
export type LifeRuleData = {
    birth: number[];
    survival: number[];
};
export declare function getLifeRuleDataError({ birth, survival }: LifeRuleData): string | "";
export declare function isLifeRuleDataType(obj: unknown): obj is LifeRuleData;
/**
 *
 * The validity of a LifeRuleData object is given
 *
 * @param lifeRuleData The LifeRuleData object to validate
 * @returns Whether the provided LifeRuleData object is valid
 */
export declare function isValidLifeRuleData(lifeRuleData: LifeRuleData): boolean;
//# sourceMappingURL=ruleData.d.ts.map