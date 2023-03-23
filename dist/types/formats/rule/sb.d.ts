import { LifeRuleData } from "./ruleData";
export declare const CONWAY_RULE_STRING_SB = "23/3";
export type SBStringNotation = "s/b";
export declare function getSBLifeStringError(lifeString: string): string | "";
export declare function isValidSBLifeString(lifeString: string): boolean;
export declare function makeSBLifeString(lifeRuleData: LifeRuleData): string;
export declare function readSBRuleString(lifeString: string): LifeRuleData;
//# sourceMappingURL=sb.d.ts.map