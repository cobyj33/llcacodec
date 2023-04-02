import { CONWAY_RULE_STRING_BS } from "./bs";
import { CONWAY_RULE_STRING_SB } from "./sb";
import { CONWAY_LIFE_RULE_INTEGER } from "./int";
import { CONWAY_LIFE_RULE_DATA, LifeRuleData } from "./ruleData";
export { CONWAY_LIFE_RULE_DATA, CONWAY_RULE_STRING_BS, CONWAY_RULE_STRING_SB, LifeRuleData, CONWAY_LIFE_RULE_INTEGER };
export type LifeRuleStringNotation = "b/s" | "s/b" | "int";
export declare function isValidLifeRule(rule: string, format: "b/s"): boolean;
export declare function isValidLifeRule(rule: string, format: "s/b"): boolean;
export declare function isValidLifeRule(rule: number, format: "int"): boolean;
export declare function isValidLifeRule(rule: string | number, format?: ""): boolean;
export declare function getLifeRuleFormat(rule: string | number): LifeRuleStringNotation | "N/A";
export declare function readLifeRule(rule: string | number, format?: LifeRuleStringNotation | ""): LifeRuleData;
export declare function makeLifeRule(lifeRuleData: LifeRuleData, format: "b/s"): string;
export declare function makeLifeRule(lifeRuleData: LifeRuleData, format: "s/b"): string;
export declare function makeLifeRule(lifeRuleData: LifeRuleData, format: "int"): number;
export declare function makeLifeRule(lifeRuleData: LifeRuleData, format: LifeRuleStringNotation): string | number;
export declare function convertLifeRule(original: string | number, dstFormat: "b/s"): string;
export declare function convertLifeRule(original: string | number, dstFormat: "s/b"): string;
export declare function convertLifeRule(original: string | number, dstFormat: "int"): number;
//# sourceMappingURL=index.d.ts.map