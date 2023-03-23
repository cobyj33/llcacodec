import { LifeRuleData } from "../rule/ruleData";
export declare const CONWAY_RULE_STRING_BS = "B3/S23";
export type BSStringNotation = "b/s";
/**
 *
 * @param lifeString The B/S notation life rule to test for errors
 *
 * @note These errors are very much not guaranteed to remain the same over releases. However, this function will always return an empty string when given a life rule without errors.
 * @returns An error describing problems with the B/S notation lifeString, or an empty string if the lifeString has no errors
 */
export declare function getBSLifeStringError(lifeString: string): string | "";
export declare function isValidBSLifeString(lifeString: string): boolean;
export declare function makeBSLifeString(lifeRuleData: LifeRuleData): string;
export declare function readBSRuleString(lifeString: string): LifeRuleData;
//# sourceMappingURL=bs.d.ts.map