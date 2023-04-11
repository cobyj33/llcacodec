/**
 * @file api.ts
 * @description The public API for the llcacodec library
 * @author Jacoby Johnson
 * @version 0.1.5
 * @date April 11th, 2023
 * @license MIT
 */
import { readLifeRule, makeLifeRule, isValidLifeRule, getLifeRuleFormat } from "./formats/rule";
import { readLifeString, writeLifeString, isLifeStringFormat, getLifeStringFormat } from "./formats/file";
export { LifeRuleData, CONWAY_LIFE_RULE_DATA } from "./formats/rule/ruleData";
export { readLifeRule, makeLifeRule, isValidLifeRule, getLifeRuleFormat } from "./formats/rule";
export { readLifeString, writeLifeString, isLifeStringFormat, getLifeStringFormat, SupportedLifeLikeReadFileFormats, SupportedLifeLikeWriteFileFormats, FileFormatEncodingData } from "./formats/file";
declare const _default: {
    readLifeString: typeof readLifeString;
    writeLifeString: typeof writeLifeString;
    isLifeStringFormat: typeof isLifeStringFormat;
    getLifeStringFormat: typeof getLifeStringFormat;
    makeLifeRule: typeof makeLifeRule;
    isValidLifeRule: typeof isValidLifeRule;
    getLifeRuleFormat: typeof getLifeRuleFormat;
    readLifeRule: typeof readLifeRule;
};
export default _default;
//# sourceMappingURL=api.d.ts.map