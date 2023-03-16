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
export declare function isValidLifeRuleData(lifeRuleData: LifeRuleData): boolean;
//# sourceMappingURL=ruleData.d.ts.map