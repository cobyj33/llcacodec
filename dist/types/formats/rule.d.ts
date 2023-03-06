export type LifeRuleData = {
    birth: number[];
    survival: number[];
};
type LifeRuleStringNotation = "B/S" | "S/B";
export declare const CONWAY_RULE_STRING_BS = "B3/S23";
export declare const CONWAY_RULE_STRING_SB = "23/3";
export declare const CONWAY_LIFE_RULE_DATA: () => {
    birth: number[];
    survival: number[];
};
export declare function isValidLifeRuleString(lifeString: string, format?: LifeRuleStringNotation | ""): boolean;
export declare function getLifeRuleStringFormat(lifeString: string): LifeRuleStringNotation | "N/A";
export declare function readLifeRuleString(lifeString: string, format?: LifeRuleStringNotation | ""): LifeRuleData;
export declare function makeLifeRuleString(birthNums: number[], survivalNums: number[], format: LifeRuleStringNotation): string;
export declare function getCanMakeLifeStringError(birthNums: number[], survivalNums: number[]): string;
export declare function canMakeLifeString(birthNums: number[], survivalNums: number[]): boolean;
export declare function getLifeStringError(lifeString: string, format: LifeRuleStringNotation): string;
export {};
//# sourceMappingURL=rule.d.ts.map